import { useEffect, useState } from "react";

const PageTransition = ({ children }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 20);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ opacity, transition: "opacity 0.25s ease" }}>{children}</div>
  );
};

export default PageTransition;
