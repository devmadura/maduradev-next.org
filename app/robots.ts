import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/instagram", "/telegram", "/facebook", "/dashboard", "/login"],
      },
    ],
    sitemap: `${process.env.NEXT_URL_PUBLISH}/sitemap.xml`,
  };
}
