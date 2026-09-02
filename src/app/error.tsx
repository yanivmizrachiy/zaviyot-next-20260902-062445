"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[zaviyot-next] route error", error);
  }, [error]);

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f8fafc",
        color: "#0f172a",
        textAlign: "center",
      }}
    >
      <section style={{ maxWidth: 560 }}>
        <h1 style={{ margin: "0 0 10px", fontSize: 30, color: "#0f2341" }}>אירעה שגיאה</h1>
        <button
          type="button"
          onClick={reset}
          style={{
            border: 0,
            borderRadius: 999,
            padding: "10px 18px",
            background: "#0f2341",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          נסו שוב
        </button>
      </section>
    </main>
  );
}
