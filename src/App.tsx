import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  MousePointer2, 
  BarChart3, 
  Settings, 
  Plus,
  Zap,
  TrendingUp,
  MousePointer,
  Target,
  ArrowRight,
  Filter,
  Download,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Layout,
  Type,
  Palette,
  Eye,
  Save,
  ChevronRight,
  Trash2,
  Clock,
  ArrowDown,
  TrendingDown,
  MoreHorizontal
} from "lucide-react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

// --- UI Components ---
import { cn, Button, Input, Card, Badge, Avatar, Skeleton, Switch } from "./components/UI";
import { Navbar, Sidebar, PageHeader } from "./components/Layout";
import { MetricCard, AnalyticsChart, LeadTable, LeadScoreBadge } from "./components/Dashboard";
import { PopupList, PopupEditor } from "./components/PopupBuilder";

import { useStore } from "./store";

const queryClient = new QueryClient();

// --- API Services ---
const fetchStats = async () => {
  const res = await fetch("/api/admin/stats");
  return res.json();
};

const fetchLeads = async () => {
  const res = await fetch("/api/admin/leads");
  return res.json();
};

const fetchPopups = async () => {
  const res = await fetch("/api/admin/popups");
  return res.json();
};

// --- Pages ---

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({ queryKey: ["stats"], queryFn: fetchStats });
  const { data: leads, isLoading: leadsLoading } = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });
  const { setPage } = useStore();

  if (isLoading || leadsLoading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PageHeader 
        title="Dashboard" 
        description="Welcome back, Alex. Here's what's happening with your leads today." 
        actions={
          <>
            <Button variant="outline" className="gap-2 hidden sm:flex"><Download className="h-4 w-4" /> Export Report</Button>
            <Button className="gap-2" onClick={() => setPage("popups")}><Plus className="h-4 w-4" /> New Popup</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <MetricCard title="Total Leads" value={stats.totalLeads.toString()} trend="up" trendValue="+12.5%" icon={Users} color="blue" />
        <MetricCard title="Total Visitors" value={stats.totalVisitors.toString()} trend="up" trendValue="+8.2%" icon={MousePointer2} color="emerald" />
        <MetricCard title="Conversion Rate" value="4.8%" trend="down" trendValue="-1.2%" icon={Target} color="amber" />
        <MetricCard title="Active Popups" value="3" trend="up" trendValue="+1" icon={Zap} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        <div className="lg:col-span-2">
          <AnalyticsChart data={stats.dailyLeads} />
        </div>
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-6">Top Converting Pages</h3>
          <div className="space-y-4">
            {[
              { path: "/pricing", rate: "12.4%", count: 450 },
              { path: "/features", rate: "8.2%", count: 320 },
              { path: "/blog/lead-gen", rate: "5.1%", count: 210 },
              { path: "/home", rate: "2.4%", count: 1200 },
            ].map((page, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate max-w-[120px] sm:max-w-none">{page.path}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{page.rate}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{page.count} views</p>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setPage("analytics")}
          >
            View Full Report
          </Button>
        </Card>
      </div>

      <LeadTable leads={leads.slice(0, 5)} />
    </motion.div>
  );
};

import { LeadTimeline } from "./components/Timeline";

const LeadsPage = () => {
  const { data: leads, isLoading } = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });

  if (isLoading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <PageHeader 
        title="Leads Management" 
        description="Manage and score your leads to prioritize high-value prospects." 
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search leads..." className="pl-10 w-full sm:w-64" />
            </div>
            <Button variant="outline" className="p-2"><Filter className="h-4 w-4" /></Button>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Lead</Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 overflow-hidden">
          <LeadTable leads={leads} />
        </div>
        <Card className="p-6 hidden lg:block">
          <LeadTimeline />
        </Card>
      </div>
    </motion.div>
  );
};

const PopupsPage = () => {
  const { data: popups, isLoading } = useQuery({ queryKey: ["popups"], queryFn: fetchPopups });
  const { editingPopup, setEditingPopup } = useStore();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (popup: any) => {
      const res = await fetch("/api/admin/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(popup)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
      setEditingPopup(null);
    }
  });

  if (isLoading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;

  if (editingPopup) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" onClick={() => setEditingPopup(null)} className="p-2">
            <X className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Editing: {editingPopup.name}</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Customize your popup's appearance and triggers.</p>
          </div>
        </div>
        <PopupEditor popup={editingPopup} onSave={(p) => saveMutation.mutate(p)} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PageHeader 
        title="Popup Builder" 
        description="Create and manage your lead capture popups." 
        actions={<Button className="gap-2" onClick={() => setEditingPopup({ 
          name: "New Popup", 
          trigger_type: "time_on_page", 
          trigger_value: "5000", 
          content: { 
            title: "Wait! Don't Leave", 
            description: "Get a free guide on lead generation.", 
            buttonText: "Download Now", 
            backgroundColor: "#ffffff", 
            textColor: "#1a1a1a" 
          } 
        })}><Plus className="h-4 w-4" /> Create New Popup</Button>}
      />
      <PopupList popups={popups} onEdit={setEditingPopup} />
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const { currentPage, setPage } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {currentPage === "dashboard" && <DashboardPage key="dashboard" />}
                {currentPage === "leads" && <LeadsPage key="leads" />}
                {currentPage === "popups" && <PopupsPage key="popups" />}
                {currentPage === "analytics" && (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                      <BarChart3 className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold">Analytics Engine</h2>
                    <p className="text-gray-500 mt-2 max-w-md">Advanced analytics and A/B testing reports are coming soon to your Pro plan.</p>
                    <Button className="mt-6" onClick={() => setPage("dashboard")}>Back to Dashboard</Button>
                  </div>
                )}
                {currentPage === "settings" && (
                  <div className="max-w-2xl">
                    <PageHeader title="Settings" description="Manage your account and API keys." />
                    <Card className="p-6 space-y-8">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold">Tracking Code</h3>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => {
                              navigator.clipboard.writeText(`<script src="${window.location.origin}/widget.js" async></script>`);
                              alert("Copied to clipboard!");
                            }}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Copy and paste this script into your website's &lt;head&gt; tag to start tracking leads.</p>
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-blue-400 overflow-x-auto">
                          <code>{`<script src="${window.location.origin}/widget.js" async></script>`}</code>
                        </div>
                      </div>
                      <div className="pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-bold mb-4">API Keys</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Production Key</p>
                            <code className="text-sm font-bold text-gray-700">lm_live_8234...9231</code>
                          </div>
                          <Button variant="outline" size="sm">Regenerate</Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
