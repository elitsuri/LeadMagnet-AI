import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  MousePointer2, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  Zap,
  Menu,
  X
} from "lucide-react";
import { cn, Button, Avatar } from "./UI";
import { create } from "zustand";
import { motion, AnimatePresence } from "motion/react";

import { useStore } from "../store";

export const Navbar = () => {
  const { toggleMobileMenu } = useStore();
  
  return (
    <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-500" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-px bg-gray-200 mx-1" />
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">Alex Rivera</p>
            <p className="text-xs text-gray-500 mt-1">Marketing Admin</p>
          </div>
          <Avatar fallback="AR" className="group-hover:ring-2 ring-blue-500 ring-offset-2 transition-all" />
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

const SidebarItem = ({ icon: Icon, label, page }: { icon: any, label: string, page: "dashboard" | "leads" | "popups" | "analytics" | "settings" }) => {
  const { currentPage, setPage, toggleMobileMenu, isMobileMenuOpen } = useStore();
  const active = currentPage === page;
  
  const handleClick = () => {
    setPage(page);
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group text-left",
        active 
          ? "bg-blue-50 text-blue-700" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
      {label}
      {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
    </button>
  );
};

const SidebarContent = () => {
  const { setPage } = useStore();
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Zap className="h-6 w-6 text-white fill-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-gray-900">LeadMagnet<span className="text-blue-600">AI</span></span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" page="dashboard" />
        <SidebarItem icon={Users} label="Leads Management" page="leads" />
        <SidebarItem icon={MousePointer2} label="Popup Builder" page="popups" />
        <SidebarItem icon={BarChart3} label="Analytics" page="analytics" />
        <SidebarItem icon={Settings} label="Settings" page="settings" />
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Pro Plan</p>
          <p className="text-sm font-medium mb-3 leading-tight">Unlock advanced lead scoring and A/B testing.</p>
          <Button 
            size="sm" 
            className="w-full bg-white text-blue-700 hover:bg-blue-50 border-none shadow-none"
            onClick={() => setPage("analytics")}
          >
            Upgrade Now
          </Button>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-4 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 bg-white h-screen flex-col sticky top-0 overflow-y-auto shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button onClick={toggleMobileMenu} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const PageHeader = ({ title, description, actions }: { title: string, description: string, actions?: React.ReactNode }) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {actions}
    </div>
  </div>
);
