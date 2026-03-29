import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer2, 
  Target, 
  Zap,
  ArrowRight,
  MoreHorizontal,
  Filter,
  Download,
  Plus
} from "lucide-react";
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
import { cn, Card, Badge, Button, Avatar } from "./UI";

export const MetricCard = ({ title, value, trend, trendValue, icon: Icon, color = "blue" }: { title: string, value: string, trend: "up" | "down", trendValue: string, icon: any, color?: string }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center", colors[color as keyof typeof colors])}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-bold", trend === "up" ? "text-emerald-600" : "text-rose-600")}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trendValue}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
    </Card>
  );
};

export const AnalyticsChart = ({ data }: { data: any[] }) => (
  <Card className="p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Conversion Overview</h3>
        <p className="text-sm text-gray-500 mt-1">Lead generation performance over the last 30 days.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">Last 30 Days</Button>
        <Button variant="outline" size="sm" className="p-2"><Filter className="h-4 w-4" /></Button>
      </div>
    </div>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
          />
          <RechartsTooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#2563eb" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorLeads)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export const LeadScoreBadge = ({ score }: { score: number }) => {
  const getVariant = () => {
    if (score >= 0.8) return "success";
    if (score >= 0.5) return "warning";
    return "danger";
  };
  const getLabel = () => {
    if (score >= 0.8) return "Hot";
    if (score >= 0.5) return "Warm";
    return "Cold";
  };
  return (
    <div className="flex items-center gap-2">
      <Badge variant={getVariant()}>{getLabel()}</Badge>
      <span className="text-xs font-bold text-gray-500">{(score * 100).toFixed(0)}%</span>
    </div>
  );
};

import { useStore } from "../store";

export const LeadTable = ({ leads }: { leads: any[] }) => {
  const { setPage } = useStore();
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Recent Leads</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="gap-2" onClick={() => setPage("leads")}><Plus className="h-4 w-4" /> Add Lead</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Lead</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={lead.name[0]} className="h-9 w-9" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-none">{lead.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <LeadScoreBadge score={lead.score} />
                </td>
                <td className="px-6 py-4">
                  <Badge variant="info">Direct</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => setPage("leads")}
        >
          View All Leads <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
