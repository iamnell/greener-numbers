import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "frame-src 'self' https://www.youtube-nocookie.com",
  "img-src 'self' data: blob:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/tools", destination: "/calculators", permanent: true },
      { source: "/ev/charging-cost-calculator", destination: "/calculators/ev-charging-cost", permanent: true },
      { source: "/ev/ev-vs-gas-calculator", destination: "/calculators/ev-vs-gas", permanent: true },
      { source: "/ev/home-charger-cost", destination: "/calculators/home-ev-charger-cost", permanent: true },
      { source: "/ev/incentives", destination: "/incentives", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
