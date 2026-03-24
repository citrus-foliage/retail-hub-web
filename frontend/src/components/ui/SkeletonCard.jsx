const SkeletonCard = () => (
  <>
    <style>{`
      @keyframes skeletonPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.45; }
      }
    `}</style>
    <div style={{ border: "1px solid #E0D8CC", backgroundColor: "#FDFAF5" }}>
      <div
        style={{
          height: "320px",
          width: "100%",
          backgroundColor: "#E8E0D0",
          animation: "skeletonPulse 1.6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          padding: "14px 16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            height: "13px",
            width: "65%",
            backgroundColor: "#E8E0D0",
            animation: "skeletonPulse 1.6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "12px",
            width: "38%",
            backgroundColor: "#E8E0D0",
            animation: "skeletonPulse 1.6s ease-in-out 0.15s infinite",
          }}
        />
      </div>
    </div>
  </>
);

export default SkeletonCard;
