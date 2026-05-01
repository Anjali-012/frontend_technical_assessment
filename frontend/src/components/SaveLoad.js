import { useStore } from "../store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
});

export const SaveLoad = () => {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(
    selector,
    shallow,
  );

  const handleSave = () => {
    const pipeline = { nodes, edges };
    localStorage.setItem("savedPipeline", JSON.stringify(pipeline));
    alert("✅ Pipeline saved!");
  };

  const handleLoad = () => {
    const saved = localStorage.getItem("savedPipeline");
    if (!saved) {
      alert("❌ No saved pipeline found!");
      return;
    }
    const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);

    // Clear current
    onNodesChange(nodes.map((n) => ({ type: "remove", id: n.id })));
    onEdgesChange(edges.map((e) => ({ type: "remove", id: e.id })));

    // Load saved
    setTimeout(() => {
      onNodesChange(savedNodes.map((n) => ({ type: "add", item: n })));
      onEdgesChange(savedEdges.map((e) => ({ type: "add", item: e })));
    }, 100);

    alert("✅ Pipeline loaded!");
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      onNodesChange(nodes.map((n) => ({ type: "remove", id: n.id })));
      onEdgesChange(edges.map((e) => ({ type: "remove", id: e.id })));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <button
        onClick={handleSave}
        style={{
          background: "#0f172a",
          border: "1px solid #3a4a5c",
          borderRadius: "8px",
          color: "#94a3b8",
          padding: "6px 14px",
          fontSize: "12px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        💾 Save
      </button>
      <button
        onClick={handleLoad}
        style={{
          background: "#0f172a",
          border: "1px solid #3a4a5c",
          borderRadius: "8px",
          color: "#94a3b8",
          padding: "6px 14px",
          fontSize: "12px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        📂 Load
      </button>
      <button
        onClick={handleClear}
        style={{
          background: "#0f172a",
          border: "1px solid #ef4444",
          borderRadius: "8px",
          color: "#ef4444",
          padding: "6px 14px",
          fontSize: "12px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        🗑️ Clear
      </button>
    </div>
  );
};
