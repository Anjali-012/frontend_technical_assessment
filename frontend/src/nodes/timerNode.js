import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const TimerNode = ({ id, data }) => {
  const [interval, setInterval] = useState(data?.interval || "5");
  const [unit, setUnit] = useState(data?.unit || "seconds");
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      title="⏱️ Timer"
      fields={[
        {
          label: "Interval",
          type: "number",
          value: interval,
          onChange: (e) => {
            setInterval(e.target.value);
            updateNodeField(id, "interval", e.target.value);
          },
          placeholder: "5",
        },
        {
          label: "Unit",
          type: "select",
          value: unit,
          onChange: (e) => {
            setUnit(e.target.value);
            updateNodeField(id, "unit", e.target.value);
          },
          options: [
            { value: "seconds", label: "Seconds" },
            { value: "minutes", label: "Minutes" },
            { value: "hours", label: "Hours" },
          ],
        },
      ]}
      handles={[{ type: "source", position: Position.Right, id: `${id}-tick` }]}
    />
  );
};
