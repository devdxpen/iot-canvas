"use client";

import React from "react";
import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Image,
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
  AlignStartVertical, // Top
  AlignVerticalJustifyCenter, // Middle
  AlignEndVertical, // Bottom
  StretchHorizontal,
  StretchVertical,
  BoxSelect,
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
  // Alignment & Distribution
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  onDistributeHorizontal: () => void;
  onDistributeVertical: () => void;
  // Grid
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
    { id: "select", icon: MousePointer2, label: "Select (Pan)" },
    { id: "multi-select", icon: BoxSelect, label: "Multi Select" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: Image, label: "Image" },
    { id: "table", icon: Table, label: "Table" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2 flex-wrap h-14">
      {/* Selection Tools */}
      <div className="flex items-center gap-1 border-r pr-2 h-full">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              selectedTool === tool.id && "bg-blue-100 text-blue-600",
            )}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.label}
          >
            <tool.icon size={16} />
          </Button>
        ))}
      </div>

      {/* Grid Controls */}
      <div className="flex items-center gap-1 border-r pr-2 h-full">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", showGrid && "bg-gray-100 text-gray-900")}
          onClick={() => setShowGrid(!showGrid)}
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <Grid size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            snapToGrid && "bg-blue-100 text-blue-600",
          )}
          onClick={() => setSnapToGrid(!snapToGrid)}
          title={snapToGrid ? "Snap to Grid: ON" : "Snap to Grid: OFF"}
        >
          <Settings size={16} />
        </Button>
      </div>

      {/* Alignment Tools (Only show when multiple items selected) */}
      <div
        className={cn(
          "flex items-center gap-1 border-r pr-2 h-full transition-opacity duration-200",
          !hasMultipleSelection && "opacity-30 pointer-events-none",
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Align Left"
          onClick={onAlignLeft}
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Align Center"
          onClick={onAlignCenter}
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Align Right"
          onClick={onAlignRight}
        >
          <AlignRight size={16} />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Align Top"
          onClick={onAlignTop}
        >
          <AlignStartVertical size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Align Middle"
          onClick={onAlignMiddle}
        >
          <AlignVerticalJustifyCenter size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Align Bottom"
          onClick={onAlignBottom}
        >
          <AlignEndVertical size={16} />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Distribute Horizontally"
          onClick={onDistributeHorizontal}
        >
          <StretchHorizontal size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Distribute Vertically"
          onClick={onDistributeVertical}
        >
          <StretchVertical size={16} />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 border-r pr-2 h-full">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Delete Selected"
          onClick={onDeleteNode}
          disabled={!hasSelection}
        >
          <Trash2 size={16} className={hasSelection ? "text-red-500" : ""} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            !canUndo && "opacity-50 cursor-not-allowed",
          )}
          title="Undo"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            !canRedo && "opacity-50 cursor-not-allowed",
          )}
          title="Redo"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Clear Canvas"
          onClick={onClear}
        >
          <Eraser size={16} className="text-orange-500" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 border-r pr-2 h-full">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Zoom In"
          onClick={onZoomIn}
        >
          <ZoomIn size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Zoom Out"
          onClick={onZoomOut}
        >
          <ZoomOut size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Fit View"
          onClick={onFitView}
        >
          <Maximize size={16} />
        </Button>
      </div>

      {/* File Operations */}
      <div className="flex items-center gap-1 border-r pr-2 h-full">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Save Template"
          onClick={onSave}
        >
          <Save size={16} className="text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Load Template"
          onClick={onLoad}
        >
          <Upload size={16} className="text-blue-600" />
        </Button>
      </div>

      {/* Template Name */}
      <div className="ml-auto flex items-center gap-2">
        <Input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="h-8 w-40 text-sm"
          placeholder="Template name..."
        />
        <Button variant="default" size="sm" className="h-8" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
