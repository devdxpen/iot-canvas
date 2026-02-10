"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  BackgroundVariant,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Toolbar } from "./Toolbar";
import { PropertiesPanel } from "./PropertiesPanel";

// ─── Widget imports: Basic ────────────────────────────────────
import { CustomNode } from "./nodes/CustomNode";
import { NumberWidget } from "./widgets/NumberWidget";
import { ImageWidget } from "./widgets/ImageWidget";
import { LampWidget } from "./widgets/LampWidget";
import { TextCardWidget } from "./widgets/TextCardWidget";
import { FunctionSwitchWidget } from "./widgets/FunctionSwitchWidget";
import { CombinationWidget } from "./widgets/CombinationWidget";
import { BitSwitchWidget } from "./widgets/BitSwitchWidget";
import { WordSwitchWidget } from "./widgets/WordSwitchWidget";
import { BoxWidget } from "./widgets/BoxWidget";
import { HyperlinkWidget } from "./widgets/HyperlinkWidget";
import { TimeWidget } from "./widgets/TimeWidget";
import { ConsoleWidget } from "./widgets/ConsoleWidget";
import { StatusWidget } from "./widgets/StatusWidget";
import { MenuButtonWidget } from "./widgets/MenuButtonWidget";
import { IndirectScreenWidget } from "./widgets/IndirectScreenWidget";
import { IframeWidget } from "./widgets/IframeWidget";
import { CardWidget } from "./widgets/CardWidget";
import { DeviceInfoWidget } from "./widgets/DeviceInfoWidget";
import { VideoWidget } from "./widgets/VideoWidget";
import { DeviceMonitorWidget } from "./widgets/DeviceMonitorWidget";
import { NavigationWidget } from "./widgets/NavigationWidget";
import { QRCodeWidget } from "./widgets/QRCodeWidget";
import { BarrageWidget } from "./widgets/BarrageWidget";
import { FlowBarWidget } from "./widgets/FlowBarWidget";
import { PipeWidget } from "./widgets/PipeWidget";
import { OvalWidget } from "./widgets/OvalWidget";

// ─── Widget imports: IoT / Display ────────────────────────────
import { TemperatureWidget } from "./widgets/TemperatureWidget";
import { LocationWidget } from "./widgets/LocationWidget";
import { AlarmWidget } from "./widgets/AlarmWidget";
import { SwitchWidget } from "./widgets/SwitchWidget";
import { RadioWidget } from "./widgets/RadioWidget";
import { SliderWidget } from "./widgets/SliderWidget";
import { ButtonWidget } from "./widgets/ButtonWidget";
import { GaugeWidget } from "./widgets/GaugeWidget";
import { ProgressWidget } from "./widgets/ProgressWidget";
import { ClimateWidget } from "./widgets/ClimateWidget";
import { VoltageWidget } from "./widgets/VoltageWidget";
import { AlertsWidget } from "./widgets/AlertsWidget";
import { HealthWidget } from "./widgets/HealthWidget";
import { ChartWidget } from "./widgets/ChartWidget";

// ─── Widget imports: Chart (Apex) & Lists ─────────────────────
import { ApexChartWidget } from "./widgets/ApexChartWidget";
import { DashboardWidget } from "./widgets/DashboardWidget";
import { ListWidget } from "./widgets/ListWidget";

// ═══════════════════════════════════════════════════════════════
// NODE_TYPES — maps every sidebar `type` string to its component
// ═══════════════════════════════════════════════════════════════
const NODE_TYPES: NodeTypes = {
  // ── Basic ──
  text: CustomNode,
  image: ImageWidget,
  number: NumberWidget,
  "bit-lamp": LampWidget,
  textcard: TextCardWidget,
  "word-lamp": LampWidget,
  "function-switch": FunctionSwitchWidget,
  combination: CombinationWidget,
  "bit-switch": BitSwitchWidget,
  "word-switch": WordSwitchWidget,
  box: BoxWidget,
  hyperlink: HyperlinkWidget,
  time: TimeWidget,
  console: ConsoleWidget,
  status: StatusWidget,
  "menu-button": MenuButtonWidget,
  "indirect-screen": IndirectScreenWidget,
  iframe: IframeWidget,
  card: CardWidget,
  "device-info": DeviceInfoWidget,
  "video-window": VideoWidget,
  "device-monitor": DeviceMonitorWidget,
  navigation: NavigationWidget,
  "qr-code": QRCodeWidget,
  barrage: BarrageWidget,
  "flow-bar": FlowBarWidget,
  pipe: PipeWidget,

  // ── Charts (ApexCharts) ──
  chart_bar: ApexChartWidget,
  histogram: ApexChartWidget,
  "ring-chart": ApexChartWidget,
  "pie-chart": ApexChartWidget,
  "radar-chart": ApexChartWidget,
  "trend-chart": ApexChartWidget,
  "line-chart": ApexChartWidget,
  horizontal: ApexChartWidget,

  // ── Dashboard ──
  dashboard: DashboardWidget,

  // ── Lists ──
  "scroll-list": ListWidget,
  "history-record": ListWidget,
  "alarm-record": ListWidget,
  "alarm-card-list": ListWidget,
  "devices-list": ListWidget,

  // ── Shapes ──
  line: CustomNode,
  rectangle: CustomNode,
  circle: CustomNode,
  triangle: CustomNode,
  oval: OvalWidget,
  table: CustomNode,

  // ── IoT / Display / Controls (from ShapePalette) ──
  temperature: TemperatureWidget,
  location: LocationWidget,
  alarm: AlarmWidget,
  switch: SwitchWidget,
  radio: RadioWidget,
  slider: SliderWidget,
  button: ButtonWidget,
  gauge: GaugeWidget,
  progress: ProgressWidget,
  climate: ClimateWidget,
  voltage: VoltageWidget,
  alerts: AlertsWidget,
  health: HealthWidget,
  chart: ChartWidget,
};

// ═══════════════════════════════════════════════════════════════
// Default dummy data for each widget type on first drop
// ═══════════════════════════════════════════════════════════════
const DEFAULT_DATA: Record<string, Record<string, unknown>> = {
  text: { label: "Text Node" },
  image: { label: "Image", imageUrl: "" },
  number: { label: "Sensor Value", value: 42, unit: "°C" },
  "bit-lamp": { label: "Bit Lamp", value: true },
  textcard: { label: "Text Card", content: "Sample card content" },
  "word-lamp": { label: "Word Lamp", value: true },
  "function-switch": { label: "Function Switch" },
  combination: { label: "Combination" },
  "bit-switch": { label: "Bit Switch" },
  "word-switch": { label: "Word Switch" },
  box: { label: "Box" },
  hyperlink: { label: "Hyperlink", url: "https://example.com" },
  time: { label: "Clock" },
  console: { label: "Console" },
  status: { label: "Status", value: "Online" },
  "menu-button": { label: "Menu" },
  "indirect-screen": { label: "Screen" },
  iframe: { label: "Iframe", url: "https://example.com" },
  card: { label: "Card" },
  "device-info": { label: "Device Info" },
  "video-window": { label: "Video" },
  "device-monitor": { label: "Device Monitor" },
  navigation: { label: "Navigation" },
  "qr-code": { label: "QR Code", value: "https://example.com" },
  barrage: { label: "Barrage" },
  "flow-bar": { label: "Flow Bar", value: 65 },
  pipe: { label: "Pipe" },

  // Charts
  chart_bar: { label: "Bar Chart" },
  histogram: { label: "Histogram" },
  "ring-chart": { label: "Ring Chart" },
  "pie-chart": { label: "Pie Chart" },
  "radar-chart": { label: "Radar Chart" },
  "trend-chart": { label: "Trend Chart" },
  "line-chart": { label: "Line Chart" },
  horizontal: { label: "Horizontal Bar" },

  dashboard: { label: "Dashboard" },

  // Lists
  "scroll-list": { label: "Scroll List" },
  "history-record": { label: "History Record" },
  "alarm-record": { label: "Alarm Record" },
  "alarm-card-list": { label: "Alarm Card List" },
  "devices-list": { label: "Devices List" },

  // Shapes
  line: { label: "Line" },
  rectangle: { label: "Rectangle" },
  circle: { label: "Circle" },
  triangle: { label: "Triangle" },
  oval: { label: "Oval" },
  table: { label: "Table" },

  // IoT
  temperature: { label: "Temperature", value: 25 },
  location: { label: "Location", location: "Zone A" },
  alarm: { label: "Alarm", status: "normal" },
  switch: { label: "Switch" },
  radio: { label: "Radio" },
  slider: { label: "Slider", value: 50 },
  button: { label: "Button" },
  gauge: { label: "Gauge", value: 65 },
  progress: { label: "Progress", value: 72 },
  climate: { label: "Climate" },
  voltage: { label: "Voltage" },
  alerts: { label: "Alerts" },
  health: { label: "Health" },
  chart: { label: "Line Chart" },
};

// ═══════════════════════════════════════════════════════════════
// CanvasEditor component
// ═══════════════════════════════════════════════════════════════
let nodeId = 0;
const getId = () => `node_${++nodeId}_${Date.now()}`;

export function CanvasEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

  // ── State ──
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[]);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState("Untitled Canvas");
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);

  // ── Undo / Redo stacks ──
  const [undoStack, setUndoStack] = useState<
    { nodes: Node[]; edges: Edge[] }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { nodes: Node[]; edges: Edge[] }[]
  >([]);

  const pushUndo = useCallback(() => {
    setUndoStack((prev) => [
      ...prev.slice(-29),
      { nodes: [...nodes], edges: [...edges] },
    ]);
    setRedoStack([]);
  }, [nodes, edges]);

  // ── Edge connection ──
  const onConnect = useCallback(
    (params: Connection) => {
      pushUndo();
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, pushUndo],
  );

  // ── Selection handling ──
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const ids = selectedNodes.map((n) => n.id);
      setSelectedNodeIds(ids);
      if (ids.length === 1) {
        setSelectedNode(selectedNodes[0]);
      } else {
        setSelectedNode(null);
      }
    },
    [],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedNodeIds([node.id]);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedNodeIds([]);
  }, []);

  // ── Drag-and-drop from sidebar ──
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      pushUndo();

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { ...(DEFAULT_DATA[type] || { label: type }) },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, pushUndo],
  );

  // ── Node actions ──
  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodeIds.length === 0) return;
    pushUndo();
    setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !selectedNodeIds.includes(e.source) &&
          !selectedNodeIds.includes(e.target),
      ),
    );
    setSelectedNode(null);
    setSelectedNodeIds([]);
  }, [selectedNodeIds, setNodes, setEdges, pushUndo]);

  const deleteNode = useCallback(
    (nodeId: string) => {
      pushUndo();
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      setSelectedNode(null);
      setSelectedNodeIds([]);
    },
    [setNodes, setEdges, pushUndo],
  );

  const duplicateNode = useCallback(
    (node: Node) => {
      pushUndo();
      const newNode: Node = {
        ...node,
        id: getId(),
        position: { x: node.position.x + 30, y: node.position.y + 30 },
        data: { ...node.data },
        selected: false,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, pushUndo],
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data } : n)));
      // Keep properties panel in sync
      setSelectedNode((prev) =>
        prev && prev.id === nodeId ? { ...prev, data } : prev,
      );
    },
    [setNodes],
  );

  // ── Undo / Redo ──
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, { nodes: [...nodes], edges: [...edges] }]);
    setUndoStack((u) => u.slice(0, -1));
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [undoStack, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, { nodes: [...nodes], edges: [...edges] }]);
    setRedoStack((r) => r.slice(0, -1));
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [redoStack, nodes, edges, setNodes, setEdges]);

  // ── Clear all ──
  const clearCanvas = useCallback(() => {
    pushUndo();
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedNodeIds([]);
  }, [setNodes, setEdges, pushUndo]);

  // ── Save & Load (JSON) ──
  const saveCanvas = useCallback(() => {
    const data = JSON.stringify({ nodes, edges, templateName }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, "_").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, templateName]);

  const loadCanvas = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          pushUndo();
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
          if (data.templateName) setTemplateName(data.templateName);
        } catch {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges, pushUndo]);

  // ── Alignment helpers ──
  const getSelectedNodes = useCallback(
    () => nodes.filter((n) => selectedNodeIds.includes(n.id)),
    [nodes, selectedNodeIds],
  );

  const alignNodes = useCallback(
    (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      const sel = getSelectedNodes();
      if (sel.length < 2) return;
      pushUndo();

      const positions = sel.map((n) => n.position);
      let target: number;

      switch (type) {
        case "left":
          target = Math.min(...positions.map((p) => p.x));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, x: target } }
                : n,
            ),
          );
          break;
        case "center": {
          const minX = Math.min(...positions.map((p) => p.x));
          const maxX = Math.max(...positions.map((p) => p.x));
          target = (minX + maxX) / 2;
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, x: target } }
                : n,
            ),
          );
          break;
        }
        case "right":
          target = Math.max(...positions.map((p) => p.x));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, x: target } }
                : n,
            ),
          );
          break;
        case "top":
          target = Math.min(...positions.map((p) => p.y));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, y: target } }
                : n,
            ),
          );
          break;
        case "middle": {
          const minY = Math.min(...positions.map((p) => p.y));
          const maxY = Math.max(...positions.map((p) => p.y));
          target = (minY + maxY) / 2;
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, y: target } }
                : n,
            ),
          );
          break;
        }
        case "bottom":
          target = Math.max(...positions.map((p) => p.y));
          setNodes((nds) =>
            nds.map((n) =>
              selectedNodeIds.includes(n.id)
                ? { ...n, position: { ...n.position, y: target } }
                : n,
            ),
          );
          break;
      }
    },
    [getSelectedNodes, selectedNodeIds, setNodes, pushUndo],
  );

  const distributeNodes = useCallback(
    (type: "horizontal" | "vertical") => {
      const sel = getSelectedNodes();
      if (sel.length < 3) return;
      pushUndo();

      const sorted = [...sel].sort((a, b) =>
        type === "horizontal"
          ? a.position.x - b.position.x
          : a.position.y - b.position.y,
      );
      const first = sorted[0].position;
      const last = sorted[sorted.length - 1].position;
      const gap =
        type === "horizontal"
          ? (last.x - first.x) / (sorted.length - 1)
          : (last.y - first.y) / (sorted.length - 1);

      const posMap = new Map<string, { x: number; y: number }>();
      sorted.forEach((n, i) => {
        posMap.set(n.id, {
          x: type === "horizontal" ? first.x + gap * i : n.position.x,
          y: type === "vertical" ? first.y + gap * i : n.position.y,
        });
      });

      setNodes((nds) =>
        nds.map((n) => {
          const pos = posMap.get(n.id);
          return pos ? { ...n, position: pos } : n;
        }),
      );
    },
    [getSelectedNodes, setNodes, pushUndo],
  );

  // ── Keyboard shortcuts ──
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelectedNodes();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    },
    [deleteSelectedNodes, undo, redo],
  );

  // Keep selected node reference up-to-date
  const currentSelectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNode?.id) || null,
    [nodes, selectedNode?.id],
  );

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Top Toolbar */}
      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onDeleteNode={deleteSelectedNodes}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onFitView={() => fitView()}
        onSave={saveCanvas}
        onLoad={loadCanvas}
        onClear={clearCanvas}
        templateName={templateName}
        setTemplateName={setTemplateName}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onAlignLeft={() => alignNodes("left")}
        onAlignCenter={() => alignNodes("center")}
        onAlignRight={() => alignNodes("right")}
        onAlignTop={() => alignNodes("top")}
        onAlignMiddle={() => alignNodes("middle")}
        onAlignBottom={() => alignNodes("bottom")}
        onDistributeHorizontal={() => distributeNodes("horizontal")}
        onDistributeVertical={() => distributeNodes("vertical")}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        hasSelection={selectedNodeIds.length > 0}
        hasMultipleSelection={selectedNodeIds.length > 1}
      />

      {/* Canvas + Properties */}
      <div className="flex flex-1 overflow-hidden">
        <div
          ref={reactFlowWrapper}
          className="flex-1 h-full"
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onSelectionChange={onSelectionChange}
            nodeTypes={NODE_TYPES}
            snapToGrid={snapToGrid}
            snapGrid={[16, 16]}
            fitView
            deleteKeyCode={null}
            className="bg-gray-50"
          >
            {showGrid && (
              <Background
                variant={BackgroundVariant.Dots}
                gap={16}
                size={1}
                color="#d1d5db"
              />
            )}
            <Controls
              position="bottom-left"
              showInteractive={false}
              className="shadow-lg! rounded-lg! border! border-gray-200!"
            />
            <MiniMap
              position="bottom-right"
              className="shadow-lg! rounded-lg! border! border-gray-200!"
              nodeColor="#6366f1"
              maskColor="rgba(0,0,0,0.08)"
              pannable
              zoomable
            />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        {/* Properties Panel — always visible for Layer tab access */}
        <PropertiesPanel
          selectedNode={currentSelectedNode}
          selectedNodes={selectedNodeIds}
          nodes={nodes}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteNode}
          onDuplicateNode={duplicateNode}
          onClose={() => {
            setSelectedNode(null);
            setSelectedNodeIds([]);
          }}
          onSelectNode={(id) => {
            const node = nodes.find((n) => n.id === id);
            if (node) {
              setSelectedNode(node);
              setSelectedNodeIds([id]);
            }
          }}
          onAlign={alignNodes}
          onDistribute={distributeNodes}
        />
      </div>
    </div>
  );
}
