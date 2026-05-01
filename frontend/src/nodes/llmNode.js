import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      title="🤖 LLM"
      fields={[
        {
          label: "Info",
          type: "text",
          value: "Large Language Model",
          onChange: () => {},
        },
      ]}
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-system`,
          style: { top: "33%" },
        },
        {
          type: "target",
          position: Position.Left,
          id: `${id}-prompt`,
          style: { top: "66%" },
        },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-response`,
        },
      ]}
    />
  );
};
