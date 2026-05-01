import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";
import { FilterNode } from "./nodes/filterNode";
import { MathNode } from "./nodes/mathNode";
import { ApiNode } from "./nodes/apiNode";
import { MergeNode } from "./nodes/mergeNode";
import { TimerNode } from "./nodes/timerNode";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  math: MathNode,
  api: ApiNode,
  merge: MergeNode,
  timer: TimerNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  // Keyboard delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only delete if not typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "Delete" || e.key === "Backspace") {
        const selectedNodes = nodes.filter((n) => n.selected);
        const selectedEdges = edges.filter((ed) => ed.selected);
        if (selectedNodes.length > 0) {
          onNodesChange(
            selectedNodes.map((n) => ({ type: "remove", id: n.id })),
          );
        }
        if (selectedEdges.length > 0) {
          onEdgesChange(
            selectedEdges.map((ed) => ({ type: "remove", id: ed.id })),
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, edges, onNodesChange, onEdgesChange]);

  // Node validation - memoized to prevent unnecessary re-renders
  const validatedNodes = useMemo(() => {
    const connectedIds = new Set([
      ...edges.map((e) => e.source),
      ...edges.map((e) => e.target),
    ]);
    return nodes.map((node) => {
      const isAlone = nodes.length > 1 && !connectedIds.has(node.id);
      return {
        ...node,
        style: {
          ...node.style,
          outline: isAlone ? "2px solid #ef4444" : "none",
          borderRadius: "12px",
        },
      };
    });
  }, [nodes, edges]);

  const getInitNodeData = (nodeID, type) => {
    return { id: nodeID, nodeType: `${type}` };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow"),
        );
        const type = appData?.nodeType;
        if (typeof type === "undefined" || !type) {
          return;
        }

        if (!reactFlowInstance) return;

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };
        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: "100vw", height: "70vh", background: "#0f172a" }}
    >
      <ReactFlow
        nodes={validatedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
      >
        <Background color="#1e3a5f" gap={gridSize} />
        <Controls
          style={{ background: "#1e2a3a", border: "1px solid #3a4a5c" }}
        />
        <MiniMap style={{ background: "#1e2a3a" }} nodeColor="#3b82f6" />
      </ReactFlow>
    </div>
  );
};
