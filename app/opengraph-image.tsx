import { ImageResponse } from "next/og";

export const alt = "ToolAtlas — AI Tools & Developer Technologies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          backgroundColor: "#06060c",
          backgroundImage:
            "radial-gradient(900px 500px at 15% 0%, rgba(139,92,246,0.45), transparent 60%), radial-gradient(800px 500px at 100% 100%, rgba(34,211,238,0.32), transparent 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
              background: "linear-gradient(135deg,#a78bfa,#6366f1,#22d3ee)",
            }}
          >
            ⚡
          </div>
          <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em" }}>ToolAtlas</div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: "76px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            maxWidth: "900px",
          }}
        >
          <span style={{ marginRight: "18px" }}>Find the right tool,</span>
          <span
            style={{
              background: "linear-gradient(120deg,#a78bfa,#6366f1,#3b82f6,#22d3ee)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            skip the noise.
          </span>
        </div>
        <div style={{ fontSize: "30px", color: "#b6b6cf", marginTop: "34px", maxWidth: "880px" }}>
          A hand-checked catalog of 2,386 AI tools and 1,861 developer technologies.
        </div>
        <div style={{ display: "flex", gap: "14px", marginTop: "48px" }}>
          {["2,386 AI Tools", "1,861 Technologies", "Always Free"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: "24px",
                fontWeight: 600,
                color: "#e9e9f5",
                padding: "12px 26px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.16)",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
