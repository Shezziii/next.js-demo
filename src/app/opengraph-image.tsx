import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/** Default social share image for every page (pages can add their own opengraph-image file). */
export const alt = `${siteConfig.name} — gym, classes and personal training in ${siteConfig.branch}`;
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
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "linear-gradient(135deg, #09090b 0%, #09090b 55%, #2B35AF 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#2B35AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            G
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
            {siteConfig.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>
            Stronger starts here.
          </div>
          <div style={{ fontSize: 32, opacity: 0.75 }}>
            {`Strength · Group classes · Personal training — ${siteConfig.branch}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
