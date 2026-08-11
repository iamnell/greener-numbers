import type { MetadataRoute } from "next";

const routes = ["", "/energy-costs", "/electricity", "/solar", "/electric-vehicles", "/home-energy", "/data", "/calculators"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `https://greenernumbers.com${route}`, lastModified: new Date(), changeFrequency: "weekly", priority: route === "" ? 1 : 0.8 }));
}
