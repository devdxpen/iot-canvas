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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Toolbar } from "@/components/canvas/Toolbar";
import { ShapePalette } from "@/components/canvas/ShapePalette";
import { TemperatureWidget } from "@/components/canvas/widgets/TemperatureWidget";
import { LocationWidget } from "@/components/canvas/widgets/LocationWidget";
import { AlarmWidget } from "@/components/canvas/widgets/AlarmWidget";
import { CustomNode } from "@/components/canvas/nodes/CustomNode";
// New advanced widgets
import { SwitchWidget } from "@/components/canvas/widgets/SwitchWidget";
import { RadioWidget } from "@/components/canvas/widgets/RadioWidget";
import { SliderWidget } from "@/components/canvas/widgets/SliderWidget";
import { GaugeWidget } from "@/components/canvas/widgets/GaugeWidget";
import { ButtonWidget } from "@/components/canvas/widgets/ButtonWidget";
import { TextCardWidget } from "@/components/canvas/widgets/TextCardWidget";
import { ImageWidget } from "@/components/canvas/widgets/ImageWidget";
import { ProgressWidget } from "@/components/canvas/widgets/ProgressWidget";
// Chart & Advanced Dashboard Widgets
import { ChartWidget } from "@/components/canvas/widgets/ChartWidget";
import { ClimateWidget } from "@/components/canvas/widgets/ClimateWidget";
import { VoltageWidget } from "@/components/canvas/widgets/VoltageWidget";
import { AlertsWidget } from "@/components/canvas/widgets/AlertsWidget";
import { HealthWidget } from "@/components/canvas/widgets/HealthWidget";
// Properties Panel
import { PropertiesPanel } from "@/components/canvas/PropertiesPanel";

// Custom node data type
export type WidgetData = {
  label?: string;
  value?: number;
  location?: string;
  status?: "active" | "warning" | "normal";
  onDelete?: (id: string) => void;
  onDuplicate?: (node: Node) => void;
};

const nodeTypes = {
  // IoT Widgets
  temperature: TemperatureWidget,
  location: LocationWidget,
  alarm: AlarmWidget,
  // Control Widgets
  switch: SwitchWidget,
  radio: RadioWidget,
  slider: SliderWidget,
  button: ButtonWidget,
  // Display Widgets
  gauge: GaugeWidget,
  progress: ProgressWidget,
  textcard: TextCardWidget,
  image: ImageWidget,
  // Chart & Dashboard Widgets
  chart: ChartWidget,
  climate: ClimateWidget,
  voltage: VoltageWidget,
  alerts: AlertsWidget,
  health: HealthWidget,
  // Basic Shapes
  rectangle: CustomNode,
  circle: CustomNode,
  line: CustomNode,
  triangle: CustomNode,
  text: CustomNode,
  picture: CustomNode,
  table: CustomNode,
};

// Use random UUID for node IDs to prevent duplicates
const getId = () => `node_${crypto.randomUUID()}`;

const CanvasFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();
  const [selectedTool, setSelectedTool] = useState("select");
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    [],
  );
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templateName, setTemplateName] = useState("Template1");

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setInterval(() => {
      if (nodes.length > 0) {
        localStorage.setItem("canvas-nodes", JSON.stringify(nodes));
        localStorage.setItem("canvas-edges", JSON.stringify(edges));
        console.log("Auto-saved canvas");
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(timer);
  }, [nodes, edges]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNodes = localStorage.getItem("canvas-nodes");
    const savedEdges = localStorage.getItem("canvas-edges");

    if (savedNodes) {
      try {
        const parsedNodes = JSON.parse(savedNodes);
        // Ensure unique IDs to prevent duplicate key errors
        const uniqueNodes: Node[] = [];
        const seenIds = new Set();

        parsedNodes.forEach((node: Node) => {
          if (!seenIds.has(node.id)) {
            seenIds.add(node.id);
            uniqueNodes.push(node);
          } else {
            // New ID for duplicates
            const newId = getId();
            uniqueNodes.push({ ...node, id: newId });
            seenIds.add(newId);
          }
        });

        setNodes(uniqueNodes);
      } catch (error) {
        console.error("Failed to parse nodes from localStorage:", error);
      }
    }

    if (savedEdges) {
      try {
        setEdges(JSON.parse(savedEdges));
      } catch (error) {
        console.error("Failed to parse edges from localStorage:", error);
      }
    }
  }, []); // Run only once on mount

  // Save to history for undo/redo
  const saveToHistory = useCallback(() => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { nodes: [...nodes], edges: [...edges] }];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [nodes, edges, historyIndex]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: "#3b82f6" } },
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

  // Define onDeleteNode first (before onDrop uses it)
  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
      saveToHistory();
    },
    [setNodes, setEdges, saveToHistory],
  );

  // Define onDuplicateNode (before onDrop uses it)
  const onDuplicateNode = useCallback(
    (node: Node) => {
      const newNode = {
        ...node,
        id: getId(),
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
        data: {
          ...node.data,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      saveToHistory();
    },
    [setNodes, saveToHistory],
  );

  // Update node data (for properties panel)
  const updateNodeData = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: newData } : node,
        ),
      );
      // Also update selectedNode if it's the same node
      setSelectedNode((current) =>
        current?.id === nodeId ? { ...current, data: newData } : current,
      );
    },
    [setNodes],
  );

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
          value:
            draggedType === "temperature"
              ? Math.floor(Math.random() * 30 + 20)
              : undefined,
          location: draggedType === "location" ? "Ahmedabad" : undefined,
          status: draggedType === "alarm" ? "normal" : undefined,
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
    saveToHistory();
  }, [setNodes, setEdges, saveToHistory]);

  const onUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const onRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const onSave = useCallback(() => {
    const data = {
      nodes,
      edges,
      templateName,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("canvas-template", JSON.stringify(data));

    // Also create downloadable file
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${templateName}.json`;
    link.click();

    alert(`Template "${templateName}" saved successfully!`);
  }, [nodes, edges, templateName]);

  const onLoad = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          const data = JSON.parse(result);
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
          setTemplateName(data.templateName || "Loaded Template");
          alert("Template loaded successfully!");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges]);

  const onClearCanvas = useCallback(() => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      setNodes([]);
      setEdges([]);
      setHistory([]);
      setHistoryIndex(-1);
    }
  }, [setNodes, setEdges, setHistory, setHistoryIndex]);

  // Alignment Functions
  const alignNodes = useCallback(
    (direction: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      if (selectedNodes.length < 2) return;

      const selectedNodeObjects = nodes.filter((n) =>
        selectedNodes.includes(n.id),
      );

      let targetValue = 0;

      switch (direction) {
        case "left":
          targetValue = Math.min(
            ...selectedNodeObjects.map((n) => n.position.x),
          );
          break;
        case "center":
          const minX = Math.min(
            ...selectedNodeObjects.map((n) => n.position.x),
          );
          const maxX = Math.max(
            ...selectedNodeObjects.map(
              (n) => n.position.x + (n.measured?.width || 0),
            ),
          );
          targetValue = minX + (maxX - minX) / 2;
          break;
        case "right":
          targetValue = Math.max(
            ...selectedNodeObjects.map(
              (n) => n.position.x + (n.measured?.width || 0),
            ),
          );
          break;
        case "top":
          targetValue = Math.min(
            ...selectedNodeObjects.map((n) => n.position.y),
          );
          break;
        case "middle":
          const minY = Math.min(
            ...selectedNodeObjects.map((n) => n.position.y),
          );
          const maxY = Math.max(
            ...selectedNodeObjects.map(
              (n) => n.position.y + (n.measured?.height || 0),
            ),
          );
          targetValue = minY + (maxY - minY) / 2;
          break;
        case "bottom":
          targetValue = Math.max(
            ...selectedNodeObjects.map(
              (n) => n.position.y + (n.measured?.height || 0),
            ),
          );
          break;
      }

      setNodes((nds) =>
        nds.map((node) => {
          if (!selectedNodes.includes(node.id)) return node;

          const width = node.measured?.width || 0;
          const height = node.measured?.height || 0;

          const newPos = { ...node.position };

          switch (direction) {
            case "left":
              newPos.x = targetValue;
              break;
            case "center":
              newPos.x = targetValue - width / 2;
              break;
            case "right":
              newPos.x = targetValue - width;
              break;
            case "top":
              newPos.y = targetValue;
              break;
            case "middle":
              newPos.y = targetValue - height / 2;
              break;
            case "bottom":
              newPos.y = targetValue - height;
              break;
          }

          return { ...node, position: newPos };
        }),
      );
      saveToHistory();
    },
    [nodes, selectedNodes, saveToHistory, setNodes],
  );

  // Distribution Functions
  const distributeNodes = useCallback(
    (direction: "horizontal" | "vertical") => {
      if (selectedNodes.length < 3) return;

      const selectedNodeObjects = nodes.filter((n) =>
        selectedNodes.includes(n.id),
      );

      // Sort nodes by position
      selectedNodeObjects.sort((a, b) =>
        direction === "horizontal"
          ? a.position.x - b.position.x
          : a.position.y - b.position.y,
      );

      const first = selectedNodeObjects[0];
      const last = selectedNodeObjects[selectedNodeObjects.length - 1];

      if (direction === "horizontal") {
        const totalSpan = last.position.x - first.position.x;
        const interval = totalSpan / (selectedNodeObjects.length - 1);

        setNodes((nds) =>
          nds.map((node) => {
            const index = selectedNodeObjects.findIndex(
              (n) => n.id === node.id,
            );
            if (
              index === -1 ||
              index === 0 ||
              index === selectedNodeObjects.length - 1
            )
              return node;

            return {
              ...node,
              position: {
                ...node.position,
                x: first.position.x + interval * index,
              },
            };
          }),
        );
      } else {
        const totalSpan = last.position.y - first.position.y;
        const interval = totalSpan / (selectedNodeObjects.length - 1);

        setNodes((nds) =>
          nds.map((node) => {
            const index = selectedNodeObjects.findIndex(
              (n) => n.id === node.id,
            );
            if (
              index === -1 ||
              index === 0 ||
              index === selectedNodeObjects.length - 1
            )
              return node;

            return {
              ...node,
              position: {
                ...node.position,
                y: first.position.y + interval * index,
              },
            };
          }),
        );
      }
      saveToHistory();
    },
    [nodes, selectedNodes, saveToHistory, setNodes],
  );

  return (
    <div className="h-screen w-screen flex flex-col">
      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onDeleteNode={() => {
          if (selectedNodes.length > 0) {
            onDeleteSelected();
          } else if (selectedNode) {
            onDeleteNode(selectedNode.id);
          }
        }}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onFitView={() => fitView()}
        onSave={onSave}
        onLoad={onLoad}
        onClear={onClearCanvas}
        templateName={templateName}
        setTemplateName={setTemplateName}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        // Alignment
        onAlignLeft={() => alignNodes("left")}
        onAlignCenter={() => alignNodes("center")}
        onAlignRight={() => alignNodes("right")}
        onAlignTop={() => alignNodes("top")}
        onAlignMiddle={() => alignNodes("middle")}
        onAlignBottom={() => alignNodes("bottom")}
        onDistributeHorizontal={() => distributeNodes("horizontal")}
        onDistributeVertical={() => distributeNodes("vertical")}
        // Grid
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
            nodeTypes={nodeTypes}
            fitView
            className="bg-white"
            snapToGrid={snapToGrid}
            snapGrid={[20, 20]}
            onSelectionChange={(elements) => {
              setSelectedNodes(elements.nodes.map((n) => n.id));
              // Set selectedNode for properties panel
              if (elements.nodes.length === 1) {
                setSelectedNode(elements.nodes[0]);
              } else {
                setSelectedNode(null);
              }
            }}
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === "temperature") return "#ef4444";
                if (node.type === "location") return "#10b981";
                if (node.type === "alarm") return "#f59e0b";
                return "#94a3b8";
              }}
            />
            <Background
              gap={20}
              size={1}
              color="#e5e7eb"
              className={showGrid ? "" : "hidden"}
            />

            <Panel
              position="top-right"
              className="bg-white p-3 rounded-lg shadow-md"
            >
              <div className="text-sm space-y-1">
                <div className="font-semibold">Stats</div>
                <div className="text-xs text-gray-600">
                  Nodes: {nodes.length}
                </div>
                <div className="text-xs text-gray-600">
                  Edges: {edges.length}
                </div>
                <div className="text-xs text-gray-600">
                  Selected: {selectedNodes.length}
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        <ShapePalette
          onDragStart={setDraggedType}
          onNodeAdd={(type) => {
            const newNode: Node = {
              id: getId(),
              type: type,
              position: { x: 250, y: 250 },
              data: {
                label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
                value:
                  type === "temperature"
                    ? Math.floor(Math.random() * 30 + 20)
                    : undefined,
                location: type === "location" ? "Ahmedabad" : undefined,
                status: type === "alarm" ? "normal" : undefined,
              },
            };
            setNodes((nds) => [...nds, newNode]);
            saveToHistory();
          }}
        />
      </div>

      {/* Properties Panel - Right Sidebar */}
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

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  );
}
