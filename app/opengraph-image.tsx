import { ImageResponse } from "next/og";
import { getCatalogStats } from "@/lib/catalogStats";

export const alt = "ToolAtlas — AI Tools & Developer Technologies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const stats = getCatalogStats();
  const toolsLabel = `${stats.totalTools.toLocaleString()} AI Tools`;
  const techLabel = `${stats.totalTech.toLocaleString()} Technologies`;
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
          backgroundColor: "#0b1120",
          backgroundImage:
            "radial-gradient(900px 500px at 15% 0%, rgba(201,161,90,0.35), transparent 60%), radial-gradient(800px 500px at 100% 100%, rgba(201,161,90,0.18), transparent 60%)",
          color: "#f7f5f0",
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
              background: "linear-gradient(135deg,#8a6d3a,#c9a15a,#e2bc7c)",
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
          <span style={{ color: "#e2bc7c" }}>
            skip the noise.
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: "30px", color: "#c9c3b4", marginTop: "34px", maxWidth: "880px" }}>
          A hand-checked catalog of {stats.totalTools.toLocaleString()} AI tools and {stats.totalTech.toLocaleString()} developer technologies.
        </div>
        <div style={{ display: "flex", gap: "14px", marginTop: "48px" }}>
          {[toolsLabel, techLabel, "Always Free"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: "24px",
                fontWeight: 600,
                color: "#f7f5f0",
                padding: "12px 26px",
                borderRadius: "999px",
                border: "1px solid rgba(201,161,90,0.28)",
                backgroundColor: "rgba(247,245,240,0.04)",
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
