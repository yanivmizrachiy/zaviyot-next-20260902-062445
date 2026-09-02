export default function Loading() {
  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      style={{
        minHeight: "45vh",
        display: "grid",
        placeItems: "center",
        background: "#f8fafc",
        color: "#475569",
        fontWeight: 700,
      }}
    >
      טוען…
    </div>
  );
}
