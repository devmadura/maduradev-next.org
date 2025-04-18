import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/instagram", "/telegram", "/facebook"],
      },
    ],
    sitemap: `${process.env.NEXT_URL_PUBLISH}/sitemap.xml`,
  };
}
