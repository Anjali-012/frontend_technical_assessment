import { useStore } from "./store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await response.json();

      alert(
        `✅ Pipeline Analysis\n\n` +
          `📦 Nodes: ${data.num_nodes}\n` +
          `🔗 Edges: ${data.num_edges}\n` +
          `🔄 Is DAG: ${data.is_dag ? "Yes ✅" : "No ❌"}`,
      );
    } catch (error) {
      alert(
        "❌ Error connecting to backend. Make sure it is running on port 8000.",
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "linear-gradient(90deg, #0f172a 0%, #1e2a3a 100%)",
        borderTop: "1px solid #2d3748",
      }}
    >
      <button
        onClick={handleSubmit}
        style={{
          background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 32px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
          letterSpacing: "0.5px",
        }}
      >
        🚀 Submit Pipeline
      </button>
    </div>
  );
};
