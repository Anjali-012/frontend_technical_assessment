import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || "add");
  const [value, setValue] = useState(data?.value || "0");

  return (
    <BaseNode
      title="🔢 Math"
      fields={[
        {
          label: "Operation",
          type: "select",
          value: operation,
          onChange: (e) => setOperation(e.target.value),
          options: [
            { value: "add", label: "Add" },
            { value: "subtract", label: "Subtract" },
            { value: "multiply", label: "Multiply" },
            { value: "divide", label: "Divide" },
          ],
        },
        {
          label: "Value",
          type: "number",
          value: value,
          onChange: (e) => setValue(e.target.value),
          placeholder: "0",
        },
      ]}
      handles={[
        {
          type: "target",
          position: Position.Left,
          id: `${id}-input`,
        },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-output`,
        },
      ]}
    />
  );
};
