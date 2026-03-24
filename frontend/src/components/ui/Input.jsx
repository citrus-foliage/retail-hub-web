import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    required = false,
    disabled = false,
    style = {},
  },
  ref,
) {
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const labelStyle = {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#5C5347",
    fontWeight: "500",
  };

  const inputStyle = {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: error ? "1px solid #8B2E2E" : "1px solid #2C2C2C",
    padding: "8px 0",
    fontSize: "14px",
    color: "#2C2C2C",
    outline: "none",
    width: "100%",
    ...style,
  };

  const errorStyle = {
    fontSize: "10px",
    color: "#8B2E2E",
    letterSpacing: "0.05em",
  };

  const hintStyle = {
    fontSize: "10px",
    color: "#8C8070",
    letterSpacing: "0.05em",
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <label htmlFor={name} style={labelStyle}>
          {label}
          {required && (
            <span style={{ color: "#8B2E2E", marginLeft: "2px" }}>*</span>
          )}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        style={inputStyle}
      />
      {error && <p style={errorStyle}>{error}</p>}
      {hint && !error && <p style={hintStyle}>{hint}</p>}
    </div>
  );
});

export default Input;
