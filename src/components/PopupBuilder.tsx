import React, { useState } from "react";
import { 
  MousePointer2, 
  Clock, 
  ArrowDown, 
  Layout, 
  Type, 
  Palette, 
  Eye, 
  Save, 
  ChevronRight,
  Trash2,
  Settings,
  Plus
} from "lucide-react";
import { cn, Card, Badge, Button, Input, Switch } from "./UI";

export const PopupList = ({ popups, onEdit }: { popups: any[], onEdit: (p: any) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {popups.map((popup) => (
      <Card key={popup.id} className="p-4 sm:p-6 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onEdit(popup)}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layout className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={popup.is_active === 1} onChange={() => {}} />
            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">{popup.name}</h3>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="info">{popup.trigger_type.replace('_', ' ')}</Badge>
          <span className="text-xs text-gray-500 font-medium">{popup.trigger_value}ms</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <MousePointer2 className="h-3 w-3" />
            12.4% Conv.
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
            <Eye className="h-3 w-3" />
            1.2k Views
          </div>
        </div>
      </Card>
    ))}
    <button className="h-full min-h-[220px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all group">
      <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
        <Plus className="h-6 w-6" />
      </div>
      <span className="text-sm font-bold">Create New Popup</span>
    </button>
  </div>
);

export const PopupEditor = ({ popup, onSave }: { popup: any, onSave: (p: any) => void }) => {
  const [data, setData] = useState(popup);

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="w-full xl:w-80 2xl:w-96 space-y-6 shrink-0">
        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-600" /> General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Popup Name</label>
              <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Trigger Type</label>
              <select 
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.trigger_type}
                onChange={(e) => setData({ ...data, trigger_type: e.target.value })}
              >
                <option value="time_on_page">Time on Page</option>
                <option value="exit_intent">Exit Intent</option>
                <option value="scroll">Scroll Depth</option>
              </select>
            </div>
            {data.trigger_type !== 'exit_intent' && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Trigger Value (ms / %)</label>
                <Input value={data.trigger_value} onChange={(e) => setData({ ...data, trigger_value: e.target.value })} />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Palette className="h-4 w-4 text-blue-600" /> Appearance
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Background Color</label>
              <div className="flex gap-2">
                <Input value={data.content.backgroundColor} onChange={(e) => setData({ ...data, content: { ...data.content, backgroundColor: e.target.value } })} />
                <div className="h-10 w-10 rounded-lg border border-gray-200 shrink-0" style={{ backgroundColor: data.content.backgroundColor }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Text Color</label>
              <div className="flex gap-2">
                <Input value={data.content.textColor} onChange={(e) => setData({ ...data, content: { ...data.content, textColor: e.target.value } })} />
                <div className="h-10 w-10 rounded-lg border border-gray-200 shrink-0" style={{ backgroundColor: data.content.textColor }} />
              </div>
            </div>
          </div>
        </Card>

        <Button className="w-full gap-2" onClick={() => onSave(data)}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="flex-1">
        <Card className="h-full min-h-[500px] lg:min-h-[600px] bg-gray-50 border-dashed border-2 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-medium text-gray-400 ml-2">Preview Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2"><Layout className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="p-2"><Type className="h-4 w-4" /></Button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 sm:p-12">
            <div 
              className="w-full max-w-md p-6 sm:p-10 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-300 scale-[0.85] sm:scale-100"
              style={{ backgroundColor: data.content.backgroundColor, color: data.content.textColor }}
            >
              <button className="absolute top-4 right-4 text-2xl opacity-40 hover:opacity-100 transition-opacity">&times;</button>
              <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">
                {data.content.title}
              </h2>
              <p className="text-lg opacity-80 mb-8 leading-relaxed">
                {data.content.description}
              </p>
              <div className="space-y-3">
                <div className="h-12 w-full rounded-xl border border-gray-200 bg-white/50" />
                <div className="h-12 w-full rounded-xl border border-gray-200 bg-white/50" />
                <Button className="w-full h-14 text-lg font-bold shadow-xl shadow-blue-500/20">
                  {data.content.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
