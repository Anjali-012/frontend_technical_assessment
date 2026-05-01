import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_"),
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      title="🎯 Input"
      fields={[
        {
          label: "Name",
          type: "text",
          value: currName,
          onChange: (e) => {
            setCurrName(e.target.value);
            updateNodeField(id, "inputName", e.target.value);
          },
        },
        {
          label: "Type",
          type: "select",
          value: inputType,
          onChange: (e) => {
            setInputType(e.target.value);
            updateNodeField(id, "inputType", e.target.value);
          },
          options: [
            { value: "Text", label: "Text" },
            { value: "File", label: "File" },
          ],
        },
      ]}
      handles={[
        { type: "source", position: Position.Right, id: `${id}-value` },
      ]}
    />
  );
};
