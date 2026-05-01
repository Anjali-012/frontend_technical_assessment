import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || "");
  const [filterType, setFilterType] = useState(data?.filterType || "include");

  return (
    <BaseNode
      title="🔍 Filter"
      fields={[
        {
          label: "Condition",
          type: "text",
          value: condition,
          onChange: (e) => setCondition(e.target.value),
          placeholder: "e.g. value > 10",
        },
        {
          label: "Filter Type",
          type: "select",
          value: filterType,
          onChange: (e) => setFilterType(e.target.value),
          options: [
            { value: "include", label: "Include" },
            { value: "exclude", label: "Exclude" },
          ],
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
