"use client";

import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";

export default function DashboardPage() {
  const [leftOpen, setLeftOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* Top Bar */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (drag widgets from here) */}
        {leftOpen && <LeftSidebar />}

        {/* Canvas Editor */}
        <ReactFlowProvider>
          <CanvasEditor />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
