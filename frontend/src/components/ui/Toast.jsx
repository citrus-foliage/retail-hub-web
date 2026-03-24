import { useEffect, useState } from "react";

const Toast = ({ message, visible, onHide }) => {
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(-8);

  useEffect(() => {
    if (visible) {
      setOpacity(1);
      setTranslateY(0);
      const timer = setTimeout(() => {
        setOpacity(0);
        setTranslateY(-8);
        setTimeout(onHide, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible && opacity === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 999,
        backgroundColor: "#2C2C2C",
        color: "#F5F0E8",
        padding: "12px 20px",
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: "none",
        maxWidth: "300px",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
