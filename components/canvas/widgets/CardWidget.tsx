"use client";
import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { LayoutDashboard } from "lucide-react";

export const CardWidget = memo(function CardWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-[200px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-indigo-500"
      />
      <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <LayoutDashboard size={12} className="text-indigo-500" />
          <span className="text-xs font-semibold text-gray-800">
            {(d.label as string) || "Card"}
          </span>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed">
          {(d.content as string) ||
            "Card content goes here. Configure via properties panel."}
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-indigo-500"
      />
    </div>
  );
});
