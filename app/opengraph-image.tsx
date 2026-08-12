import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f5f3ed", color: "#09201c", padding: "74px" }}><div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: -1 }}><span style={{ color: "#5d876d" }}>GREENER</span> NUMBERS</div><div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1, fontWeight: 700, letterSpacing: -4 }}><span>The economics</span><span>of going green.</span></div><div style={{ display: "flex", fontSize: 24, color: "#426058" }}>Independent data journalism for practical energy decisions.</div></div>, size);
}
