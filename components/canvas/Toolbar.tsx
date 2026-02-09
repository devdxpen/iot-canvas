"use client";

import React from "react";
import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Table,
  Minus,
  Triangle,
  Trash2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Upload,
  Settings,
  Grid,
  Maximize,
  Eraser,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignVerticalJustifyCenter,
  AlignEndVertical,
  StretchHorizontal,
  StretchVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ToolbarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  onDeleteNode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  onDistributeHorizontal: () => void;
  onDistributeVertical: () => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  hasSelection: boolean;
  hasMultipleSelection: boolean;
}

export function Toolbar({
  selectedTool,
  setSelectedTool,
  onDeleteNode,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  onSave,
  onLoad,
  onClear,
  templateName,
  setTemplateName,
  canUndo,
  canRedo,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onAlignTop,
  onAlignMiddle,
  onAlignBottom,
  onDistributeHorizontal,
  onDistributeVertical,
  showGrid,
  setShowGrid,
  snapToGrid,
  setSnapToGrid,
  hasSelection,
  hasMultipleSelection,
}: ToolbarProps) {
  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: ImageIcon, label: "Image" },
  ];

  return (
    <div className="bg-white border-b h-14 px-4 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-1 h-full py-2">
        {/* Tools */}
        <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8",
                selectedTool === tool.id && "bg-blue-100 text-blue-600",
              )}
              onClick={() => setSelectedTool(tool.id)}
              title={tool.label}
            >
              <tool.icon size={16} />
            </Button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-0.5 border-r pr-2 mr-2">
          <Button
            variant={showGrid ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={snapToGrid ? "secondary" : "ghost"}
            size="icon"
            className={cn("h-8 w-8", snapToGrid && "text-blue-600")}
            onClick={() => setSnapToGrid(!snapToGrid)}
            title="Snap to Grid"
          >
            <Settings size={16} />
          </Button>
        </div>

        {/* Alignment */}
        <div
          className={cn(
            "flex items-center gap-0.5 border-r pr-2 mr-2 transition-opacity",
            !hasMultipleSelection && "opacity-40 pointer-events-none",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignLeft}
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignCenter}
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignRight}
          >
            <AlignRight size={16} />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignTop}
          >
            <AlignStartVertical size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignMiddle}
          >
            <AlignVerticalJustifyCenter size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAlignBottom}
          >
            <AlignEndVertical size={16} />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            disabled={!hasSelection}
            onClick={onDeleteNode}
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <Undo size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClear}
          >
            <Eraser size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 rounded-md px-1 p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onZoomOut}
          >
            <ZoomOut size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onFitView}
          >
            <Maximize size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onZoomIn}
          >
            <ZoomIn size={14} />
          </Button>
        </div>

        <div className="flex items-center gap-2 border-l pl-3">
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="h-8 w-40 text-sm bg-gray-50"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={onLoad}
            title="Import JSON"
          >
            <Upload size={14} />
          </Button>
          <Button size="sm" className="h-8 px-3 gap-1" onClick={onSave}>
            <Save size={14} /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}
