import { MetadataRoute } from "next";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/events", "/teams"],
      },
    ],
    sitemap: `${process.env.NEXT_URL_PUBLISH}/sitemap.xml`,
  };
}
