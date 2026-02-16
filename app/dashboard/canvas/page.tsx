"use client";

import { Header } from "@/components/layout/Header";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { ReactFlowProvider } from "@xyflow/react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* Top Bar */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <CanvasEditor />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
