export const siteUrl = "https://greenernumbers.com";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const defaultOpenGraph = {
  images: "/opengraph-image",
  siteName: "Greener Numbers",
  locale: "en_US",
};
