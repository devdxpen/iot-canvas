import React from "react";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  Share2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Share2 size={18} className="text-indigo-600" />
          </div>
          <span>IoT Studio</span>
        </div>
      </div>

      {/* Center: Search or Title */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5 w-96">
        <Search size={16} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search components, widgets..."
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <Download size={16} />
          Export
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Settings size={20} />
        </Button>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white ml-2">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
