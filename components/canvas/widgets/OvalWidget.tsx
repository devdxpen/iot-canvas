"use client";
import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export const OvalWidget = memo(function OvalWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: 160, height: 100 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-gray-400"
      />
      <div className="w-full h-full rounded-[50%] border-2 border-gray-400 bg-white shadow-md flex items-center justify-center">
        <span className="text-xs text-gray-600 font-medium">
          {(d.label as string) || "Oval"}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-gray-400"
      />
    </div>
  );
});
