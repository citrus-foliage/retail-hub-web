import { useState } from "react";

const buttonStyles = {
  primary: {
    base: {
      backgroundColor: "#2C2C2C",
      color: "#F5F0E8",
      border: "none",
      cursor: "pointer",
    },
    hover: {
      backgroundColor: "#1a1a1a",
    },
  },
  secondary: {
    base: {
      backgroundColor: "transparent",
      color: "#2C2C2C",
      border: "1px solid #2C2C2C",
      cursor: "pointer",
    },
    hover: {
      backgroundColor: "#2C2C2C",
      color: "#F5F0E8",
    },
  },
  ghost: {
    base: {
      backgroundColor: "transparent",
      color: "#2C2C2C",
      border: "none",
      cursor: "pointer",
    },
    hover: {
      backgroundColor: "#EDE8DF",
    },
  },
  danger: {
    base: {
      backgroundColor: "transparent",
      color: "#8B2E2E",
      border: "1px solid #8B2E2E",
      cursor: "pointer",
    },
    hover: {
      backgroundColor: "#8B2E2E",
      color: "#fff",
    },
  },
};

const sizeStyles = {
  sm: { padding: "6px 16px", fontSize: "10px" },
  md: { padding: "10px 24px", fontSize: "11px" },
  lg: { padding: "14px 32px", fontSize: "12px" },
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
  style = {},
}) => {
  const [hovered, setHovered] = useState(false);

  const computedStyle = {
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: "500",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    width: fullWidth ? "100%" : "auto",
    ...buttonStyles[variant].base,
    ...sizeStyles[size],
    ...(hovered && !disabled ? buttonStyles[variant].hover : {}),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={computedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
