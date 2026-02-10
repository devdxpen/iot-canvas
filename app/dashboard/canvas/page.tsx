"use client";

import { CanvasArea } from "@/components/layout/CanvasArea";
import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import React, { useState } from "react";

export default function DashboardPage() {
  // State to toggle sidebars (optional, for responsiveness)
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* 1. Top Bar (Fixed Height) */}
      <Header />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar (Tools/Navigation) */}
        {leftOpen && <LeftSidebar />}

        {/* 3. Center Canvas Area (Flexible Width) */}
        <main className="flex-1 relative overflow-hidden bg-gray-100 relative">
          <CanvasArea />
        </main>

        {/* 4. Right Sidebar (Properties/Config) */}
        {rightOpen && <RightSidebar />}
      </div>
    </div>
  );
}
