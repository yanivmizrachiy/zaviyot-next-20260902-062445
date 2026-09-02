import Link from "next/link";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f8fafc",
        color: "#0f172a",
        textAlign: "center",
      }}
    >
      <section style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: "#0f2341", lineHeight: 1 }}>404</div>
        <h1 style={{ margin: "14px 0 8px", fontSize: 30 }}>העמוד לא נמצא</h1>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: 14,
            padding: "10px 18px",
            borderRadius: 999,
            background: "#0f2341",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          עמוד הבית
        </Link>
      </section>
    </main>
  );
}
