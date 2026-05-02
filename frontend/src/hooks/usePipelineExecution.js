import { useState, useCallback } from "react";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const usePipelineExecution = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [nodeStatuses, setNodeStatuses] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const setNodeStatus = (nodeId, status) => {
    setNodeStatuses((prev) => ({ ...prev, [nodeId]: status }));
  };

  const analyzePipeline = useCallback(
    async (run = false) => {
      setIsRunning(true);
      setNodeStatuses({});

      try {
        if (run) {
          // Animate nodes as running
          nodes.forEach((node) => setNodeStatus(node.id, "idle"));
        }

        const response = await fetch("http://localhost:8000/pipelines/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes, edges, run }),
        });

        if (run) {
          // Simulate node-by-node execution visualization
          for (const node of nodes) {
            setNodeStatus(node.id, "running");
            await new Promise((r) => setTimeout(r, 600));
            setNodeStatus(node.id, "success");
            await new Promise((r) => setTimeout(r, 200));
          }
        }

        const data = await response.json();
        setResult(data);
        setModalOpen(true);
      } catch (error) {
        setResult({ error: "Failed to connect to backend" });
        setModalOpen(true);
      } finally {
        setIsRunning(false);
        // Clear statuses after 3 seconds
        setTimeout(() => setNodeStatuses({}), 3000);
      }
    },
    [nodes, edges],
  );

  return {
    nodeStatuses,
    isRunning,
    result,
    modalOpen,
    setModalOpen,
    analyzePipeline,
  };
};
