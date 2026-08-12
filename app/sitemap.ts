import type { MetadataRoute } from "next";

const routes = ["", "/electricity-bills-rising", "/ev-vs-gas-costs", "/solar-payback", "/data", "/calculators", "/methodology", "/editorial-standards", "/about", "/advertise"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `https://greenernumbers.com${route}`, lastModified: new Date(), changeFrequency: "weekly", priority: route === "" ? 1 : 0.8 }));
}
