"use client";

import React from "react";
import {
  Menu,
  LayoutGrid,
  Maximize2,
  RefreshCw,
  Power,
  Bell,
} from "lucide-react";

export function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Menu size={18} className="text-gray-600" />
        </button>
        <div className="flex items-baseline gap-0 select-none">
          <span
            className="text-[22px] tracking-tight leading-none"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <span className="text-[#4A9FD8] italic font-normal">LINKED</span>
            <span className="text-gray-900 font-extrabold not-italic">IOT</span>
          </span>
        </div>
      </div>

      {/* Center-Right: Action + Icons */}
      <div className="flex items-center gap-5">
        <span className="text-sm text-gray-500 font-medium hidden md:inline">
          Action
        </span>
        <div className="flex items-center gap-0.5">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Grid View"
          >
            <LayoutGrid size={17} className="text-gray-400" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize2 size={17} className="text-gray-400" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={17} className="text-gray-400" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Power"
          >
            <Power size={17} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
              alt="Anna Adame"
              width={36}
              height={36}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* Online dot */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[1.5px] border-white" />
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={17} className="text-gray-400" />
          </button>
          <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
            28
          </span>
        </div>

        {/* User info */}
        <div className="hidden md:flex flex-col items-end leading-none">
          <span className="text-[13px] font-semibold text-gray-900">
            Anna Adame
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">Founder</span>
        </div>
      </div>
    </header>
  );
}
