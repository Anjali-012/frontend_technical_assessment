import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export const ApiNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || "");
  const [method, setMethod] = useState(data?.method || "GET");
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      title="🌐 API Call"
      fields={[
        {
          label: "URL",
          type: "text",
          value: url,
          onChange: (e) => {
            setUrl(e.target.value);
            updateNodeField(id, "url", e.target.value);
          },
          placeholder: "https://api.example.com",
        },
        {
          label: "Method",
          type: "select",
          value: method,
          onChange: (e) => {
            setMethod(e.target.value);
            updateNodeField(id, "method", e.target.value);
          },
          options: [
            { value: "GET", label: "GET" },
            { value: "POST", label: "POST" },
            { value: "PUT", label: "PUT" },
            { value: "DELETE", label: "DELETE" },
          ],
        },
      ]}
      handles={[
        { type: "target", position: Position.Left, id: `${id}-input` },
        { type: "source", position: Position.Right, id: `${id}-output` },
        {
          type: "source",
          position: Position.Right,
          id: `${id}-error`,
          style: { top: "75%" },
        },
      ]}
    />
  );
};
