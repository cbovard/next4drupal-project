import siteConfig from "../site.config";

/**
 * Returns language context value for a page.
 *
 */
export const setLanguageLinks = (translations = []) => {
  const languageLinks = siteConfig.locales;
  Object.entries(translations).forEach((translation) => {
    languageLinks[translation[0]].path = translation[1];
  });
  return languageLinks;
};
