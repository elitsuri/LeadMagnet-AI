import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import morgan from "morgan";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("leadmagnet.db");
const JWT_SECRET = process.env.JWT_SECRET || "leadmagnet-secret-key-123";

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    api_key TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS visitors (
    id TEXT PRIMARY KEY,
    ip TEXT,
    user_agent TEXT,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT,
    email TEXT,
    name TEXT,
    score REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(visitor_id) REFERENCES visitors(id)
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT,
    type TEXT,
    page TEXT,
    data TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(visitor_id) REFERENCES visitors(id)
  );

  CREATE TABLE IF NOT EXISTS popups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    trigger_type TEXT, -- exit_intent, time_on_page, scroll
    trigger_value TEXT,
    content TEXT, -- JSON string
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    popup_id INTEGER,
    visitor_id TEXT,
    type TEXT, -- view, lead
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(popup_id) REFERENCES popups(id),
    FOREIGN KEY(visitor_id) REFERENCES visitors(id)
  );
`);

// Seed default popup if none exist
const popupCount = db.prepare("SELECT COUNT(*) as count FROM popups").get() as { count: number };
if (popupCount.count === 0) {
  db.prepare(`
    INSERT INTO popups (name, trigger_type, trigger_value, content)
    VALUES (?, ?, ?, ?)
  `).run(
    "Welcome Offer",
    "time_on_page",
    "5000",
    JSON.stringify({
      title: "Wait! Get 20% Off",
      description: "Subscribe to our newsletter and get a discount on your first purchase.",
      buttonText: "Claim Discount",
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a"
    })
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // --- API Routes ---

  // Tracking API (Public)
  app.post("/api/track", (req, res) => {
    const { visitor_id, type, page, data } = req.body;
    const ip = req.ip;
    const user_agent = req.get("User-Agent");

    // Upsert visitor
    db.prepare(`
      INSERT INTO visitors (id, ip, user_agent)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP
    `).run(visitor_id, ip, user_agent);

    // Record event
    db.prepare(`
      INSERT INTO events (visitor_id, type, page, data)
      VALUES (?, ?, ?, ?)
    `).run(visitor_id, type, page, JSON.stringify(data));

    res.json({ success: true });
  });

  // Lead Capture API (Public)
  app.post("/api/lead", (req, res) => {
    const { visitor_id, email, name, popup_id } = req.body;

    // Calculate initial score based on events
    const events = db.prepare("SELECT type, page FROM events WHERE visitor_id = ?").all() as any[];
    let score = 0.1; // Base score
    score += events.length * 0.05;
    if (events.some(e => e.page.includes("pricing"))) score += 0.3;
    if (events.some(e => e.type === "exit_intent")) score += 0.2;
    score = Math.min(score, 1.0);

    const result = db.prepare(`
      INSERT INTO leads (visitor_id, email, name, score)
      VALUES (?, ?, ?, ?)
    `).run(visitor_id, email, name, score);

    if (popup_id) {
      db.prepare(`
        INSERT INTO conversions (popup_id, visitor_id, type)
        VALUES (?, ?, ?)
      `).run(popup_id, visitor_id, "lead");
    }

    res.json({ success: true, lead_id: result.lastInsertRowid });
  });

  // Get active popups (Public)
  app.get("/api/popups/active", (req, res) => {
    const popups = db.prepare("SELECT * FROM popups WHERE is_active = 1").all();
    res.json(popups.map((p: any) => ({ ...p, content: JSON.parse(p.content) })));
  });

  // Admin API (Protected - simplified for now)
  app.get("/api/admin/stats", (req, res) => {
    const totalLeads = db.prepare("SELECT COUNT(*) as count FROM leads").get() as any;
    const totalVisitors = db.prepare("SELECT COUNT(*) as count FROM visitors").get() as any;
    const recentLeads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 10").all();
    
    // Analytics for chart
    const dailyLeads = db.prepare(`
      SELECT date(created_at) as date, COUNT(*) as count 
      FROM leads 
      GROUP BY date(created_at) 
      ORDER BY date ASC 
      LIMIT 30
    `).all();

    res.json({
      totalLeads: totalLeads.count,
      totalVisitors: totalVisitors.count,
      recentLeads,
      dailyLeads
    });
  });

  app.get("/api/admin/leads", (req, res) => {
    const leads = db.prepare(`
      SELECT l.*, v.ip, v.user_agent 
      FROM leads l 
      JOIN visitors v ON l.visitor_id = v.id 
      ORDER BY l.created_at DESC
    `).all();
    res.json(leads);
  });

  app.get("/api/admin/popups", (req, res) => {
    const popups = db.prepare("SELECT * FROM popups").all();
    res.json(popups.map((p: any) => ({ ...p, content: JSON.parse(p.content) })));
  });

  app.post("/api/admin/popups", (req, res) => {
    const { name, trigger_type, trigger_value, content } = req.body;
    db.prepare(`
      INSERT INTO popups (name, trigger_type, trigger_value, content)
      VALUES (?, ?, ?, ?)
    `).run(name, trigger_type, trigger_value, JSON.stringify(content));
    res.json({ success: true });
  });

  // Serve the tracking widget script
  app.get("/widget.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "widget.js"));
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LeadMagnet AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
