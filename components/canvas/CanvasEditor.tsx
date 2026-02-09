"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  useReactFlow,
  Node,
  Edge,
  Connection,
  Panel,
  OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";

// Hooks
import { useCanvasHistory } from "@/hooks/useCanvasHistory";
import { useCanvasAlignment } from "@/hooks/useCanvasAlignment";

// Components
import { Toolbar } from "@/components/canvas/Toolbar";
import { ShapePalette } from "@/components/canvas/ShapePalette";
import { PropertiesPanel } from "@/components/canvas/PropertiesPanel";

// Widgets
import { TemperatureWidget } from "@/components/canvas/widgets/TemperatureWidget";
import { LocationWidget } from "@/components/canvas/widgets/LocationWidget";
import { AlarmWidget } from "@/components/canvas/widgets/AlarmWidget";
import { CustomNode } from "@/components/canvas/nodes/CustomNode";
import { SwitchWidget } from "@/components/canvas/widgets/SwitchWidget";
import { RadioWidget } from "@/components/canvas/widgets/RadioWidget";
import { SliderWidget } from "@/components/canvas/widgets/SliderWidget";
import { GaugeWidget } from "@/components/canvas/widgets/GaugeWidget";
import { ButtonWidget } from "@/components/canvas/widgets/ButtonWidget";
import { TextCardWidget } from "@/components/canvas/widgets/TextCardWidget";
import { ImageWidget } from "@/components/canvas/widgets/ImageWidget";
import { ProgressWidget } from "@/components/canvas/widgets/ProgressWidget";
import { ChartWidget } from "@/components/canvas/widgets/ChartWidget";
import { ClimateWidget } from "@/components/canvas/widgets/ClimateWidget";
import { VoltageWidget } from "@/components/canvas/widgets/VoltageWidget";
import { AlertsWidget } from "@/components/canvas/widgets/AlertsWidget";
import { HealthWidget } from "@/components/canvas/widgets/HealthWidget";

// --- Constants ---

const SNAP_GRID: [number, number] = [20, 20];

const NODE_TYPES = {
  // IoT
  temperature: TemperatureWidget,
  location: LocationWidget,
  alarm: AlarmWidget,
  // Control
  switch: SwitchWidget,
  radio: RadioWidget,
  slider: SliderWidget,
  button: ButtonWidget,
  // Display
  gauge: GaugeWidget,
  progress: ProgressWidget,
  textcard: TextCardWidget,
  image: ImageWidget,
  // Dashboard
  chart: ChartWidget,
  climate: ClimateWidget,
  voltage: VoltageWidget,
  alerts: AlertsWidget,
  health: HealthWidget,
  // Shapes
  rectangle: CustomNode,
  circle: CustomNode,
  line: CustomNode,
  triangle: CustomNode,
  text: CustomNode,
  picture: CustomNode,
  table: CustomNode,
};

// --- Helper Functions ---

const getId = () => `node_${crypto.randomUUID()}`;

// --- Main Flow Component ---

const CanvasFlow = () => {
  // -- State --
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

  // -- UI State --
  const [selectedTool, setSelectedTool] = useState("select");
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [templateName, setTemplateName] = useState("New Dashboard");

  // -- Custom Hooks --
  const { saveToHistory, onUndo, onRedo, canUndo, canRedo } = useCanvasHistory(
    nodes,
    edges,
    setNodes,
    setEdges,
  );

  const { alignNodes, distributeNodes } = useCanvasAlignment(
    nodes,
    setNodes,
    saveToHistory,
  );

  // -- Effects --

  // Auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      if (nodes.length > 0) {
        localStorage.setItem("canvas-nodes", JSON.stringify(nodes));
        localStorage.setItem("canvas-edges", JSON.stringify(edges));
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [nodes, edges]);

  // Load Initial Data
  useEffect(() => {
    const savedNodes = localStorage.getItem("canvas-nodes");
    const savedEdges = localStorage.getItem("canvas-edges");
    if (savedNodes) {
      try {
        const parsed = JSON.parse(savedNodes);
        const uniqueNodes: Node[] = [];
        const seenIds = new Set();
        parsed.forEach((node: Node) => {
          if (!seenIds.has(node.id)) {
            seenIds.add(node.id);
            uniqueNodes.push(node);
          } else {
            uniqueNodes.push({ ...node, id: getId() });
          }
        });
        setNodes(uniqueNodes);
      } catch (e) {
        console.error(e);
      }
    }
    if (savedEdges) {
      try {
        setEdges(JSON.parse(savedEdges));
      } catch (e) {
        console.error(e);
      }
    }
  }, [setNodes, setEdges]);

  // -- Event Handlers --

  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      setSelectedNodes(nodes.map((n) => n.id));
      setSelectedNode(nodes.length === 1 ? nodes[0] : null);
    },
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          eds,
        ),
      );
      saveToHistory();
    },
    [saveToHistory, setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!draggedType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type: draggedType,
        position,
        data: {
          label: `${draggedType.charAt(0).toUpperCase() + draggedType.slice(1)}`,
          value: draggedType === "temperature" ? 25 : undefined,
          location: "Zone A",
          status: "normal",
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setDraggedType(null);
      saveToHistory();
    },
    [screenToFlowPosition, draggedType, setNodes, saveToHistory],
  );

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    setSelectedNodes([]);
    setSelectedNode(null);
    saveToHistory();
  }, [setNodes, setEdges, saveToHistory]);

  const onDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      saveToHistory();
    },
    [setNodes, setEdges, saveToHistory],
  );

  const onDuplicateNode = useCallback(
    (node: Node) => {
      const newNode = {
        ...node,
        id: getId(),
        position: { x: node.position.x + 20, y: node.position.y + 20 },
        selected: true,
      };
      setNodes((nds) => [
        ...nds.map((n) => ({ ...n, selected: false })),
        newNode,
      ]);
      saveToHistory();
    },
    [setNodes, saveToHistory],
  );

  const updateNodeData = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n,
        ),
      );
      setSelectedNode((curr) =>
        curr?.id === nodeId
          ? { ...curr, data: { ...curr.data, ...newData } }
          : curr,
      );
    },
    [setNodes],
  );

  const onSave = useCallback(() => {
    const data = {
      nodes,
      edges,
      templateName,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("canvas-template", JSON.stringify(data));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${templateName.replace(/\s+/g, "_")}.json`;
    link.click();
    toast.success(`Template "${templateName}" saved!`);
  }, [nodes, edges, templateName]);

  const onLoad = useCallback(() => {
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
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
          setTemplateName(data.templateName || "Imported");
          toast.success("Loaded successfully");
        } catch {
          toast.error("Invalid JSON");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges]);

  // Memoized Props for ReactFlow
  const miniMapNodeColor = useCallback((n: Node) => {
    if (n.type === "temperature") return "#ef4444";
    if (n.type === "chart") return "#22c55e";
    return "#94a3b8";
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onDeleteNode={onDeleteSelected}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitView={fitView}
        onSave={onSave}
        onLoad={onLoad}
        onClear={() => {
          if (confirm("Clear canvas?")) {
            setNodes([]);
            setEdges([]);
            toast.info("Cleared");
          }
        }}
        templateName={templateName}
        setTemplateName={setTemplateName}
        canUndo={canUndo}
        canRedo={canRedo}
        onAlignLeft={() => alignNodes(selectedNodes, "left")}
        onAlignCenter={() => alignNodes(selectedNodes, "center")}
        onAlignRight={() => alignNodes(selectedNodes, "right")}
        onAlignTop={() => alignNodes(selectedNodes, "top")}
        onAlignMiddle={() => alignNodes(selectedNodes, "middle")}
        onAlignBottom={() => alignNodes(selectedNodes, "bottom")}
        onDistributeHorizontal={() =>
          distributeNodes(selectedNodes, "horizontal")
        }
        onDistributeVertical={() => distributeNodes(selectedNodes, "vertical")}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        snapToGrid={snapToGrid}
        setSnapToGrid={setSnapToGrid}
        hasSelection={selectedNodes.length > 0}
        hasMultipleSelection={selectedNodes.length > 1}
      />

      <div className="flex-1 flex overflow-hidden">
        <div
          ref={reactFlowWrapper}
          className="flex-1 h-full relative"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={NODE_TYPES}
            fitView
            className="bg-gray-50"
            snapToGrid={snapToGrid} // <--- CORRECTED: boolean
            snapGrid={SNAP_GRID} // <--- CORRECTED: [number, number]
            onSelectionChange={onSelectionChange}
          >
            <Controls showInteractive={false} />
            <MiniMap zoomable pannable nodeColor={miniMapNodeColor} />
            <Background
              gap={20}
              size={1}
              color="#cbd5e1"
              className={showGrid ? "" : "hidden"}
            />
            <Panel
              position="top-right"
              className="bg-white/90 backdrop-blur-sm p-2 rounded-md border shadow-sm text-xs text-gray-500"
            >
              Nodes: {nodes.length} | Selected: {selectedNodes.length}
            </Panel>
          </ReactFlow>
        </div>

        <ShapePalette
          onDragStart={setDraggedType}
          onNodeAdd={(type) => {
            const newNode = {
              id: getId(),
              type,
              position: { x: 100, y: 100 },
              data: { label: type },
            };
            setNodes((nds) => [...nds, newNode]);
            saveToHistory();
          }}
        />
      </div>

      {showPropertiesPanel && (
        <PropertiesPanel
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
          onDeleteNode={onDeleteNode}
          onDuplicateNode={onDuplicateNode}
          onClose={() => setShowPropertiesPanel(false)}
        />
      )}
    </div>
  );
};

export default function CanvasEditor() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  );
}
