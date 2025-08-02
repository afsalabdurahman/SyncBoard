import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Headphones,
  Settings,
  ToggleLeft,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SidebarProps {
  currentPage: any;
  setCurrentPage: any;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  currentPage,
  setCurrentPage,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [navigationItems, setNavigateItems] = useState([
    { name: "Dashboard", icon: LayoutDashboard, active: true },
    { name: "Workspaces", icon: Building2, active: false },
    { name: "Users", icon: Users, active: false },
    { name: "Subscriptions", icon: CreditCard, active: false },
    { name: "Analytics", icon: BarChart3, active: false },
    { name: "Abuse Reports", icon: Shield, active: false },
    { name: "Support Tickets", icon: Headphones, active: false },
    { name: "System Settings", icon: Settings, active: false },
    { name: "Feature Toggles", icon: ToggleLeft, active: false },
    { name: "Logs", icon: FileText, active: false },
  ]);
  const handleClick = (clickedName: any) => {
    const updatedItems = navigationItems.map((item) => ({
      ...item,
      active: item.name === clickedName,
    }));
    setNavigateItems(updatedItems);
  };
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className='flex h-full flex-col'>
        {/* Logo */}
        <div className='flex h-16 items-center justify-between px-4 border-b border-gray-200'>
          {!collapsed && (
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>S</span>
              </div>
              <span className='font-semibold text-gray-900'>SaaS Admin</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
          >
            {collapsed ? (
              <ChevronRight className='h-4 w-4 text-gray-600' />
            ) : (
              <ChevronLeft className='h-4 w-4 text-gray-600' />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3 py-4 space-y-1'>
          {navigationItems.map((item) => (
            <a
              onClick={() => {
                setCurrentPage(item.name);
                handleClick(item.name);
              }}
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ",
                item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")}
              />
              {!collapsed && <span>{item.name}</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
