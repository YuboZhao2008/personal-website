import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#141614",
        color: "#f1f2e9",
        padding: "58px 64px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 17,
          color: "#abb3a0",
          borderBottom: "1px solid #46503d",
          paddingBottom: 24,
        }}
      >
        <span>SOFTWARE ENGINEERING × INTELLIGENT SYSTEMS</span>
        <span>WATERLOO, ON</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 142,
          fontWeight: 700,
          letterSpacing: -9,
          marginTop: 30,
        }}
      >
        YUBO <span style={{ color: "#c5f277", marginLeft: 28 }}>ZHAO.</span>
      </div>
      <div style={{ display: "flex", fontSize: 31, marginTop: 12 }}>
        Building systems that perceive, reason, and interact.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 21,
          color: "#abb3a0",
          marginTop: 21,
        }}
      >
        University of Waterloo · Software Engineering
      </div>
      <div
        style={{
          display: "flex",
          gap: 46,
          fontSize: 22,
          color: "#c5f277",
          borderTop: "1px solid #46503d",
          paddingTop: 28,
          marginTop: "auto",
        }}
      >
        <span>TEAM CANADA / IOAI 2025</span>
        <span>2ND GLOBALLY / FTC WORLD 2024</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
