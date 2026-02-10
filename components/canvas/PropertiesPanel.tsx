"use client";

import React, { useState } from "react";
import { Node } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  Copy,
  Trash2,
  Settings,
  Type,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter, // Middle
  AlignStartVertical, // Top
  AlignEndVertical, // Bottom
  MousePointer2,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
} from "lucide-react";

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedNodes: string[];
  nodes: Node[];
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (node: Node) => void;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  onAlign: (
    type: "left" | "center" | "right" | "top" | "middle" | "bottom",
  ) => void;
  onDistribute: (type: "horizontal" | "vertical") => void;
}

const colorPresets = [
  { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
  { name: "Green", value: "#22c55e", bg: "bg-green-500" },
  { name: "Purple", value: "#8b5cf6", bg: "bg-purple-500" },
  { name: "Orange", value: "#f97316", bg: "bg-orange-500" },
  { name: "Red", value: "#ef4444", bg: "bg-red-500" },
  { name: "Cyan", value: "#06b6d4", bg: "bg-cyan-500" },
  { name: "Pink", value: "#ec4899", bg: "bg-pink-500" },
  { name: "Gray", value: "#64748b", bg: "bg-gray-500" },
];

export function PropertiesPanel({
  selectedNode,
  selectedNodes,
  nodes,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onClose,
  onSelectNode,
  onAlign,
  onDistribute,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("properties");

  const nodeData = (selectedNode?.data as Record<string, unknown>) || {};
  const nodeType = selectedNode?.type || "unknown";

  // Check if we have multiple nodes selected
  const isMultiSelect = selectedNodes.length > 1;
  const hasSelection = selectedNodes.length > 0;

  const updateField = (field: string, value: unknown) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { ...nodeData, [field]: value });
    }
  };

  const getWidgetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      temperature: "Temperature Sensor",
      location: "Location Tracker",
      alarm: "Alarm Alert",
      switch: "Toggle Switch",
      radio: "Radio Buttons",
      slider: "Slider Control",
      button: "Action Button",
      gauge: "Gauge Meter",
      progress: "Progress Bar",
      textcard: "Text Card",
      image: "Image Display",
      chart: "Line Chart",
      climate: "Climate Control",
      voltage: "Voltage Monitor",
      alerts: "Alerts Panel",
      health: "Health Status",
      rectangle: "Rectangle",
      circle: "Circle",
      line: "Line",
      triangle: "Triangle",
      text: "Text",
      picture: "Picture",
      table: "Table",
    };
    return labels[type] || type;
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Inspector</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Top Level Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-4 pb-0 bg-white">
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="properties" className="text-xs">
              Properties
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-xs">
              Layers
            </TabsTrigger>
            <TabsTrigger value="data" className="text-xs">
              Data
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          {/* --- PROPERTIES TAB --- */}
          <TabsContent value="properties" className="p-4 space-y-6 m-0 h-full">
            {!hasSelection ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <MousePointer2 size={32} className="mb-2 opacity-20" />
                <p className="text-sm">Select an element</p>
              </div>
            ) : (
              <>
                {/* Selection Info */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    {isMultiSelect
                      ? `${selectedNodes.length} Selected`
                      : getWidgetTypeLabel(nodeType)}
                  </span>
                  {!isMultiSelect && (
                    <span className="text-[10px] text-gray-400 font-mono">
                      {selectedNode?.id.slice(0, 8)}
                    </span>
                  )}
                </div>

                {/* Alignment Actions */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Alignment
                  </Label>
                  <div className="flex flex-col gap-2">
                    {/* Horizontal & Vertical Align */}
                    <div className="flex items-center justify-between bg-gray-50 p-1 rounded-md border border-gray-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("left")}
                        title="Align Left"
                      >
                        <AlignLeft size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("center")}
                        title="Align Center"
                      >
                        <AlignCenter size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("right")}
                        title="Align Right"
                      >
                        <AlignRight size={14} />
                      </Button>
                      <div className="w-px h-4 bg-gray-200 mx-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("top")}
                        title="Align Top"
                      >
                        <AlignStartVertical size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("middle")}
                        title="Align Middle"
                      >
                        <AlignVerticalJustifyCenter size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm"
                        onClick={() => onAlign("bottom")}
                        title="Align Bottom"
                      >
                        <AlignEndVertical size={14} />
                      </Button>
                    </div>
                    {/* Distribution */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs gap-2"
                        onClick={() => onDistribute("horizontal")}
                      >
                        <AlignHorizontalSpaceAround size={14} />
                        Distribute H
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs gap-2"
                        onClick={() => onDistribute("vertical")}
                      >
                        <AlignVerticalSpaceAround size={14} />
                        Distribute V
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Dimensions (Only if single select or consistent) */}
                {!isMultiSelect && selectedNode && (
                  <div className="space-y-3">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Dimensions
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block">
                          Width
                        </span>
                        <Input
                          type="number"
                          className="h-8 text-sm bg-gray-50"
                          value={
                            selectedNode.measured?.width ||
                            selectedNode.width ||
                            "auto"
                          }
                          readOnly
                          disabled
                          placeholder="Auto"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block">
                          Height
                        </span>
                        <Input
                          type="number"
                          className="h-8 text-sm bg-gray-50"
                          value={
                            selectedNode.measured?.height ||
                            selectedNode.height ||
                            "auto"
                          }
                          readOnly
                          disabled
                          placeholder="Auto"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block">
                          X Position
                        </span>
                        <Input
                          type="number"
                          className="h-8 text-sm bg-gray-50"
                          value={Math.round(selectedNode.position.x)}
                          readOnly
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 mb-1 block">
                          Y Position
                        </span>
                        <Input
                          type="number"
                          className="h-8 text-sm bg-gray-50"
                          value={Math.round(selectedNode.position.y)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance (Replaces Style Tab) */}
                {!isMultiSelect && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Appearance
                    </Label>

                    {/* Color Presets */}
                    <div className="space-y-2">
                      <span className="text-xs text-gray-600">Theme Color</span>
                      <div className="grid grid-cols-5 gap-2">
                        {colorPresets.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateField("color", color.value)}
                            className={`aspect-square rounded-full transition-all ${color.bg} ${
                              nodeData.color === color.value
                                ? "ring-2 ring-offset-2 ring-gray-900 scale-90"
                                : "hover:scale-110"
                            }`}
                            title={color.name}
                          />
                        ))}
                        {/* Custom Color Picker Button */}
                        <div className="relative aspect-square rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
                          <input
                            type="color"
                            value={(nodeData.color as string) || "#ffffff"}
                            onChange={(e) =>
                              updateField("color", e.target.value)
                            }
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          />
                          <span className="relative text-[10px] font-bold text-gray-600">
                            +
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Opacity */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Opacity</span>
                        <span className="text-xs text-gray-400">
                          {(nodeData.opacity as number) || 100}%
                        </span>
                      </div>
                      <Slider
                        value={[(nodeData.opacity as number) || 100]}
                        onValueChange={([v]) => updateField("opacity", v)}
                        min={10}
                        max={100}
                        step={5}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Actions
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        selectedNode && onDuplicateNode(selectedNode)
                      }
                    >
                      <Copy size={14} className="mr-2" />
                      Clone
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        selectedNode && onDeleteNode(selectedNode.id)
                      }
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* --- LAYERS TAB --- */}
          <TabsContent value="layers" className="p-0 m-0 h-full relative">
            <div className="absolute inset-0 overflow-y-auto">
              {nodes.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No layers
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {[...nodes].reverse().map((node) => {
                    // Reverse to show top layers first
                    const isSelected = selectedNodes.includes(node.id);
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode(node.id)}
                        className={`flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? "bg-indigo-50 border-l-4 border-indigo-500 pl-2" : "border-l-4 border-transparent"}`}
                      >
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                          {/* Ideally we'd map type to icon here too, simpler for now */}
                          <Layers size={14} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span
                            className={`truncate font-medium ${isSelected ? "text-indigo-700" : "text-gray-700"}`}
                          >
                            {(node.data?.label as string) || node.type}
                          </span>
                          <span className="text-[10px] text-gray-400 capitalize">
                            {node.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* --- DATA TAB --- */}
          <TabsContent value="data" className="p-4 space-y-6 m-0 h-full">
            {!selectedNode || isMultiSelect ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Type size={32} className="mb-2 opacity-20" />
                <p className="text-sm">
                  {isMultiSelect ? "Select single item" : "Select an element"}
                </p>
              </div>
            ) : (
              <>
                {/* Common Data Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700">
                      Label Text
                    </Label>
                    <Input
                      value={(nodeData.label as string) || ""}
                      onChange={(e) => updateField("label", e.target.value)}
                      className="text-sm bg-gray-50"
                    />
                  </div>

                  {/* Widget Specific Data */}

                  {/* Value */}
                  {[
                    "temperature",
                    "gauge",
                    "progress",
                    "slider",
                    "climate",
                    "health",
                    "voltage",
                  ].includes(nodeType) && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-700">
                        Current Value
                      </Label>
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[(nodeData.value as number) || 50]}
                          onValueChange={([v]) => updateField("value", v)}
                          min={0}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={(nodeData.value as number) || 50}
                          onChange={(e) =>
                            updateField("value", parseInt(e.target.value))
                          }
                          className="w-16 h-8 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {nodeType === "location" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-700">
                        Location
                      </Label>
                      <Input
                        value={(nodeData.location as string) || ""}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
                        placeholder="e.g. Zone A"
                        className="text-sm"
                      />
                    </div>
                  )}

                  {/* Image URL */}
                  {nodeType === "image" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-700">
                        Image Source URL
                      </Label>
                      <Input
                        value={(nodeData.imageUrl as string) || ""}
                        onChange={(e) =>
                          updateField("imageUrl", e.target.value)
                        }
                        placeholder="https://..."
                        className="text-sm font-mono"
                      />
                    </div>
                  )}

                  {/* Content Text */}
                  {nodeType === "textcard" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-700">
                        Detailed Content
                      </Label>
                      <textarea
                        value={(nodeData.content as string) || ""}
                        onChange={(e) => updateField("content", e.target.value)}
                        rows={4}
                        className="w-full text-sm rounded-md border border-gray-200 p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                  )}

                  {/* Status */}
                  {nodeType === "alarm" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-700">
                        Alarm Status
                      </Label>
                      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        {["normal", "warning", "active"].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateField("status", status)}
                            className={`flex-1 py-1.5 text-[10px] font-medium uppercase rounded-md transition-all ${
                              nodeData.status === status
                                ? status === "active"
                                  ? "bg-red-500 text-white shadow-sm"
                                  : status === "warning"
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "bg-green-500 text-white shadow-sm"
                                : "text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
