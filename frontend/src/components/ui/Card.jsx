import { useState } from "react";

const Card = ({ children, onClick, style = {} }) => {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    backgroundColor: "#FDFAF5",
    border: "1px solid #E8E0D0",
    padding: "20px",
    transition: "box-shadow 0.2s ease",
    boxShadow: hovered
      ? "0 4px 12px rgba(0,0,0,0.08)"
      : "0 1px 4px rgba(0,0,0,0.04)",
    cursor: onClick ? "pointer" : "default",
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};

export default Card;
