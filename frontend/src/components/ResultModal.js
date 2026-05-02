import React from "react";

export const ResultModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1e2a3a 0%, #16202e 100%)",
          border: "1px solid #3a4a5c",
          borderRadius: "16px",
          padding: "32px",
          minWidth: "400px",
          maxWidth: "600px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            🚀 Pipeline Analysis
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #3a4a5c",
              borderRadius: "8px",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "4px 10px",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              border: "1px solid #3b82f6",
            }}
          >
            <div
              style={{ fontSize: "28px", fontWeight: "700", color: "#3b82f6" }}
            >
              {data?.num_nodes || 0}
            </div>
            <div
              style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}
            >
              Nodes
            </div>
          </div>

          <div
            style={{
              background: "#0f172a",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              border: "1px solid #6366f1",
            }}
          >
            <div
              style={{ fontSize: "28px", fontWeight: "700", color: "#6366f1" }}
            >
              {data?.num_edges || 0}
            </div>
            <div
              style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}
            >
              Edges
            </div>
          </div>

          <div
            style={{
              background: "#0f172a",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              border: `1px solid ${data?.is_dag ? "#22c55e" : "#ef4444"}`,
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: data?.is_dag ? "#22c55e" : "#ef4444",
              }}
            >
              {data?.is_dag ? "✅" : "❌"}
            </div>
            <div
              style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}
            >
              Is DAG
            </div>
          </div>
        </div>

        {/* Execution Results */}
        {data?.execution_results &&
          Object.keys(data.execution_results).length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Pipeline Output
              </div>
              {Object.entries(data.execution_results).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    background: "#0f172a",
                    borderRadius: "10px",
                    padding: "14px",
                    marginBottom: "10px",
                    border: "1px solid #22c55e",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#22c55e",
                      fontWeight: "600",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    {key}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#e2e8f0",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {value || "No output"}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Run Pipeline Button */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid #3a4a5c",
              borderRadius: "8px",
              color: "#94a3b8",
              padding: "10px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
