import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_URL_PUBLISH}/`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${process.env.NEXT_URL_PUBLISH}/events`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_URL_PUBLISH}/teams`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}
