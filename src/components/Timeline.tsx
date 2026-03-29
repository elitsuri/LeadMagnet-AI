import React from "react";
import { 
  Circle, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MousePointer2, 
  Eye, 
  UserPlus 
} from "lucide-react";
import { cn } from "./UI";

export const TimelineItem = ({ icon: Icon, title, time, description, last = false }: { icon: any, title: string, time: string, description: string, last?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      {!last && <div className="w-0.5 h-full bg-gray-100 my-1" />}
    </div>
    <div className="pb-8">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{time}</span>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

export const LeadTimeline = () => (
  <div className="p-4 sm:p-6">
    <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Activity Timeline</h3>
    <div className="space-y-0">
      <TimelineItem 
        icon={UserPlus} 
        title="Lead Captured" 
        time="2 mins ago" 
        description="Alex Rivera signed up via 'Welcome Offer' popup on /pricing page." 
      />
      <TimelineItem 
        icon={MousePointer2} 
        title="Exit Intent Triggered" 
        time="5 mins ago" 
        description="Visitor showed exit intent on the pricing page." 
      />
      <TimelineItem 
        icon={Eye} 
        title="Pricing Page Viewed" 
        time="8 mins ago" 
        description="Visitor spent 3 minutes analyzing the Pro plan features." 
      />
      <TimelineItem 
        icon={Clock} 
        title="Session Started" 
        time="15 mins ago" 
        description="New visitor session initiated from Google Search (Organic)." 
        last 
      />
    </div>
  </div>
);
