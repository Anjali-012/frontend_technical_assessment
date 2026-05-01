import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || "add");
  const [value, setValue] = useState(data?.value || "0");
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleOperation = (e) => {
    setOperation(e.target.value);
    updateNodeField(id, "operation", e.target.value);
  };

  const handleValue = (e) => {
    setValue(e.target.value);
    updateNodeField(id, "value", e.target.value);
  };

  return (
    <BaseNode
      title="🔢 Math"
      fields={[
        {
          label: "Operation",
          type: "select",
          value: operation,
          onChange: handleOperation,
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
          onChange: handleValue,
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
