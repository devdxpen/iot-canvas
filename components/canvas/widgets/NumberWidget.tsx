"use client";
import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export const NumberWidget = memo(function NumberWidget({
  data,
  id,
}: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-[160px] text-center">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-blue-500"
      />
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
        {(d.label as string) || "Value"}
      </span>
      <div className="text-3xl font-bold text-gray-900 mt-1 font-mono">
        {(d.value as number) ?? 42}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 block">
        {(d.unit as string) || "units"}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-blue-500"
      />
    </div>
  );
});
