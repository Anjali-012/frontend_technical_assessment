import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const MergeNode = ({ id, data }) => {
  const [mergeStrategy, setMergeStrategy] = useState(
    data?.mergeStrategy || "concat",
  );
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      title="🔀 Merge"
      fields={[
        {
          label: "Strategy",
          type: "select",
          value: mergeStrategy,
          onChange: (e) => {
            setMergeStrategy(e.target.value);
            updateNodeField(id, "mergeStrategy", e.target.value);
          },
          options: [
            { value: "concat", label: "Concatenate" },
            { value: "zip", label: "Zip" },
            { value: "union", label: "Union" },
            { value: "intersect", label: "Intersect" },
          ],
        },
      ]}
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-input1`,
          style: { top: "33%" },
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-input2`,
          style: { top: "66%" },
        },
        { type: "source", position: Position.Right, id: `${id}-output` },
      ]}
    />
  );
};
