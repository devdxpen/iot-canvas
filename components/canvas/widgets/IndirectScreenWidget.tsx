"use client";
import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Monitor } from "lucide-react";

export const IndirectScreenWidget = memo(function IndirectScreenWidget({
  data,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 w-[240px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-cyan-500"
      />
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <Monitor size={12} className="text-cyan-400" />
        <span className="text-[10px] text-gray-400 font-medium">
          {(d.label as string) || "Screen"}
        </span>
      </div>
      <div className="h-[140px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Monitor size={28} className="text-gray-700 mx-auto mb-1" />
          <span className="text-[10px] text-gray-600">Screen Preview</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-cyan-500"
      />
    </div>
  );
});
