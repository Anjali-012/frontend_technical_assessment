import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "linear-gradient(90deg, #0f172a 0%, #1e2a3a 100%)",
        borderBottom: "1px solid #2d3748",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#64748b",
          marginBottom: "10px",
          fontWeight: "600",
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Pipeline Nodes
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="filter" label="Filter" />
        <DraggableNode type="math" label="Math" />
        <DraggableNode type="api" label="API Call" />
        <DraggableNode type="merge" label="Merge" />
        <DraggableNode type="timer" label="Timer" />
      </div>
    </div>
  );
};
