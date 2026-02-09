"use client";

import React from "react";
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
  Palette,
  Settings,
  Type,
  Hash,
  Layers,
} from "lucide-react";

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (node: Node) => void;
  onClose: () => void;
}

const colorPresets = [
  { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
  { name: "Green", value: "#22c55e", bg: "bg-green-500" },
  { name: "Purple", value: "#8b5cf6", bg: "bg-purple-500" },
  { name: "Orange", value: "#f97316", bg: "bg-orange-500" },
  { name: "Red", value: "#ef4444", bg: "bg-red-500" },
  { name: "Cyan", value: "#06b6d4", bg: "bg-cyan-500" },
  { name: "Pink", value: "#ec4899", bg: "bg-pink-500" },
  { name: "Yellow", value: "#eab308", bg: "bg-yellow-500" },
];

export function PropertiesPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onClose,
}: PropertiesPanelProps) {
  if (!selectedNode) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 p-4 flex flex-col items-center justify-center text-gray-400">
        <Layers size={48} className="mb-4 opacity-50" />
        <p className="text-sm text-center">
          Select a widget to edit its properties
        </p>
      </div>
    );
  }

  const nodeData = selectedNode.data as Record<string, unknown>;
  const nodeType = selectedNode.type || "unknown";

  const updateField = (field: string, value: unknown) => {
    onUpdateNode(selectedNode.id, { ...nodeData, [field]: value });
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
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Properties</h3>
          <p className="text-xs text-gray-500">
            {getWidgetTypeLabel(nodeType)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="general" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 m-2"
            style={{ width: "calc(100% - 16px)" }}
          >
            <TabsTrigger value="general" className="text-xs">
              <Settings size={14} className="mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette size={14} className="mr-1" />
              Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="p-4 space-y-4">
            {/* Title/Label */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <Type size={14} />
                Title / Label
              </Label>
              <Input
                value={(nodeData.label as string) || ""}
                onChange={(e) => updateField("label", e.target.value)}
                placeholder="Enter title..."
                className="text-sm"
              />
            </div>

            {/* Value (for numeric widgets) */}
            {[
              "temperature",
              "gauge",
              "progress",
              "slider",
              "climate",
              "health",
            ].includes(nodeType) && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Hash size={14} />
                  Value
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
                  <span className="text-sm font-medium w-10 text-right">
                    {(nodeData.value as number) || 50}
                  </span>
                </div>
              </div>
            )}

            {/* Location (for location widget) */}
            {nodeType === "location" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Location Name
                </Label>
                <Input
                  value={(nodeData.location as string) || ""}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g., Building A, Floor 2"
                  className="text-sm"
                />
              </div>
            )}

            {/* Status (for alarm widget) */}
            {nodeType === "alarm" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Status
                </Label>
                <div className="flex gap-2">
                  {["normal", "warning", "active"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateField("status", status)}
                      className={`flex-1 py-2 text-xs rounded-md border transition-colors ${
                        nodeData.status === status
                          ? status === "active"
                            ? "bg-red-500 text-white border-red-500"
                            : status === "warning"
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-green-500 text-white border-green-500"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image URL (for image widget) */}
            {nodeType === "image" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Image URL
                </Label>
                <Input
                  value={(nodeData.imageUrl as string) || ""}
                  onChange={(e) => updateField("imageUrl", e.target.value)}
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>
            )}

            {/* Text content (for textcard) */}
            {nodeType === "textcard" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Content
                </Label>
                <textarea
                  value={(nodeData.content as string) || ""}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Enter text content..."
                  rows={3}
                  className="w-full text-sm rounded-md border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Position Info */}
            <div className="pt-4 border-t border-gray-100">
              <Label className="text-xs font-medium text-gray-500 mb-2 block">
                Position
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-gray-400">X</span>
                  <Input
                    type="number"
                    value={Math.round(selectedNode.position.x)}
                    onChange={(e) => {
                      // Position updates handled separately
                    }}
                    className="text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-400">Y</span>
                  <Input
                    type="number"
                    value={Math.round(selectedNode.position.y)}
                    className="text-sm"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            {/* Color Preset */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">
                Color Theme
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateField("color", color.value)}
                    className={`w-full aspect-square rounded-lg ${color.bg} hover:scale-110 transition-transform ${
                      nodeData.color === color.value
                        ? "ring-2 ring-offset-2 ring-gray-900"
                        : ""
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">
                Custom Color
              </Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(nodeData.color as string) || "#3b82f6"}
                  onChange={(e) => updateField("color", e.target.value)}
                  className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                />
                <Input
                  value={(nodeData.color as string) || "#3b82f6"}
                  onChange={(e) => updateField("color", e.target.value)}
                  placeholder="#3b82f6"
                  className="text-sm flex-1"
                />
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">
                Opacity
              </Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[(nodeData.opacity as number) || 100]}
                  onValueChange={([v]) => updateField("opacity", v)}
                  min={10}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-10 text-right">
                  {(nodeData.opacity as number) || 100}%
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDuplicateNode(selectedNode)}
          >
            <Copy size={14} className="mr-1" />
            Duplicate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDeleteNode(selectedNode.id)}
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center">
          ID: {selectedNode.id}
        </p>
      </div>
    </div>
  );
}
