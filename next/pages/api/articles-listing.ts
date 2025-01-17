import { NextApiRequest, NextApiResponse } from "next";
import { DrupalNode } from "next-drupal";
import { drupal } from "lib/drupal";

import { validateAndCleanupArticleTeaser } from "@/lib/zod/article-teaser";

import siteConfig from "@/site.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const languagePrefix =
      req.headers["accept-language"] || siteConfig.defaultLocale;

    const limit = Number(req.query.limit) || 10;
    const articleTeasers = await drupal.getResourceCollection<DrupalNode[]>(
      "node--article",
      {
        params: {
          "filter[status]": 1,
          "filter[langcode]": languagePrefix,
          "fields[node--article]": "title,path,field_image,uid,created",
          include: "field_image,uid",
          sort: "-created",
          "page[limit]": limit,
        },
        locale: languagePrefix,
        defaultLocale: siteConfig.defaultLocale,
      }
    );

    const validatedArticleTeasers = articleTeasers.map((articleNode) =>
      validateAndCleanupArticleTeaser(articleNode)
    );

    // Set cache headers: 60 seconds max-age, stale-while-revalidate
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

    res.json(validatedArticleTeasers);
  }

  res.end();
}
