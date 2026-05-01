import { useState } from "react";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { ResultModal } from "./components/ResultModal";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [runPipeline, setRunPipeline] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges, run: runPipeline }),
      });

      const data = await response.json();
      setModalData(data);
      setModalOpen(true);
    } catch (error) {
      alert(
        "❌ Error connecting to backend. Make sure it is running on port 8000.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "16px",
          background: "linear-gradient(90deg, #0f172a 0%, #1e2a3a 100%)",
          borderTop: "1px solid #2d3748",
        }}
      >
        {/* Toggle Run Pipeline */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#94a3b8",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={runPipeline}
            onChange={(e) => setRunPipeline(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Run Pipeline (uses OpenAI)
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading
              ? "#334155"
              : "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 32px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 15px rgba(59,130,246,0.4)",
            letterSpacing: "0.5px",
            transition: "all 0.2s",
          }}
        >
          {loading ? "⏳ Analyzing..." : "🚀 Submit Pipeline"}
        </button>
      </div>
    </>
  );
};
