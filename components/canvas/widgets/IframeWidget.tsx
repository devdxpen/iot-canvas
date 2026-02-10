"use client";
import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";

export const IframeWidget = memo(function IframeWidget({ data }: NodeProps) {
  const d = data as Record<string, unknown>;
  const url = (d.url as string) || "";
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-[300px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-blue-500"
      />
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <Globe size={12} className="text-blue-500" />
        <span className="text-[10px] text-gray-600 font-mono truncate flex-1">
          {url || "No URL set"}
        </span>
      </div>
      {url ? (
        <iframe
          src={url}
          className="w-full h-[180px] border-0"
          sandbox="allow-scripts"
          title="iframe"
        />
      ) : (
        <div className="h-[180px] flex items-center justify-center bg-gray-50 text-gray-400 text-xs">
          <div className="text-center">
            <Globe size={24} className="mx-auto mb-2 opacity-30" />
            <span>Set URL in properties</span>
          </div>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-blue-500"
      />
    </div>
  );
});
