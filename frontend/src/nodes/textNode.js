import { useState, useEffect } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "");
  const [variables, setVariables] = useState([]);
  const [nodeSize, setNodeSize] = useState({ width: 220, height: 80 });
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(currText)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    setVariables(matches);

    const lines = currText.split("\n").length;
    const width = Math.max(220, Math.min(500, currText.length * 8 + 60));
    const height = Math.max(80, lines * 24 + 60);
    setNodeSize({ width, height });

    // Save to store
    updateNodeField(id, "text", currText);
  }, [currText, id, updateNodeField]);

  const dynamicHandles = variables.map((v, i) => ({
    type: "target",
    position: Position.Left,
    id: `${id}-${v}`,
    style: { top: `${((i + 1) / (variables.length + 1)) * 100}%` },
  }));

  return (
    <div style={{ position: "relative" }}>
      <BaseNode
        title="📝 Text"
        style={{ width: nodeSize.width, minHeight: nodeSize.height }}
        fields={[
          {
            label: "Text",
            type: "textarea",
            value: currText,
            onChange: (e) => setCurrText(e.target.value),
            rows: Math.max(2, currText.split("\n").length),
            style: { width: "100%" },
          },
        ]}
        handles={[
          ...dynamicHandles,
          {
            type: "source",
            position: Position.Right,
            id: `${id}-output`,
          },
        ]}
      />
      {variables.map((v, i) => (
        <div
          key={v}
          style={{
            position: "absolute",
            left: "-8px",
            top: `${((i + 1) / (variables.length + 1)) * 100}%`,
            transform: "translateY(-50%)",
            fontSize: "9px",
            color: "#94a3b8",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {v}
        </div>
      ))}
    </div>
  );
};
