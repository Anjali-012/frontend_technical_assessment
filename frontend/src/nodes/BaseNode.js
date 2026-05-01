import { Handle } from "reactflow";

export const BaseNode = ({
  title,
  fields,
  handles = [],
  children,
  style = {},
}) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e2a3a 0%, #16202e 100%)",
        border: "1px solid #3a4a5c",
        borderRadius: "12px",
        minWidth: "220px",
        minHeight: "80px",
        padding: "0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        fontFamily: "Inter, sans-serif",
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
          borderRadius: "10px 10px 0 0",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#fff",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {fields &&
          fields.map((field, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <label
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  fontWeight: "500",
                }}
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={field.value}
                  onChange={field.onChange}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#e2e8f0",
                    padding: "4px 8px",
                    fontSize: "12px",
                    outline: "none",
                  }}
                >
                  {field.options.map((opt, j) => (
                    <option key={j} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={field.value}
                  onChange={field.onChange}
                  rows={field.rows || 3}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#e2e8f0",
                    padding: "4px 8px",
                    fontSize: "12px",
                    outline: "none",
                    resize: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    ...field.style,
                  }}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder || ""}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#e2e8f0",
                    padding: "4px 8px",
                    fontSize: "12px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          ))}
        {children}
      </div>

      {/* Handles */}
      {handles.map((handle, i) => (
        <Handle
          key={i}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            background: "#3b82f6",
            border: "2px solid #1e2a3a",
            width: "10px",
            height: "10px",
            ...handle.style,
          }}
        />
      ))}
    </div>
  );
};
