import { ResultModal } from "./components/ResultModal";
import { useState } from "react";

export const SubmitButton = ({ executionState }) => {
  const [runPipeline, setRunPipeline] = useState(false);
  const { isRunning, result, modalOpen, setModalOpen, analyzePipeline } =
    executionState;

  return (
    <>
      <ResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={result}
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
          Run Pipeline (uses Groq AI)
        </label>

        <button
          onClick={() => analyzePipeline(runPipeline)}
          disabled={isRunning}
          style={{
            background: isRunning
              ? "#334155"
              : "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 32px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: isRunning ? "not-allowed" : "pointer",
            boxShadow: isRunning ? "none" : "0 4px 15px rgba(59,130,246,0.4)",
            letterSpacing: "0.5px",
            transition: "all 0.2s",
          }}
        >
          {isRunning ? "⏳ Executing..." : "🚀 Submit Pipeline"}
        </button>
      </div>
    </>
  );
};
