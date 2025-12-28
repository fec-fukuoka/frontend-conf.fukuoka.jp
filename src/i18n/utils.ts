import {
  ui,
  defaultLang,
  type SupportedLang,
  type TranslationKeys,
} from "./ui";

/**
 * Parse Accept-Language header to determine preferred language
 */
function parseAcceptLanguage(header: string): string | null {
  const languages = header.split(",").map((lang) => {
    const [code, qValue] = lang.trim().split(";q=");
    return {
      code: code.split("-")[0].toLowerCase(), // 'ja-JP' -> 'ja'
      q: qValue ? parseFloat(qValue) : 1.0,
    };
  });

  languages.sort((a, b) => b.q - a.q);

  for (const { code } of languages) {
    if (code in ui) {
      return code;
    }
  }
  return null;
}

/**
 * SSR: Determine language from request
 * Priority: 1. ?hl= query param 2. Accept-Language header 3. default
 */
export function getLangFromRequest(request: Request, url: URL): SupportedLang {
  // 1. Check query parameter
  const hlParam = url.searchParams.get("hl");
  if (hlParam && hlParam in ui) {
    return hlParam as SupportedLang;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language");
  if (acceptLanguage) {
    const preferredLang = parseAcceptLanguage(acceptLanguage);
    if (preferredLang && preferredLang in ui) {
      return preferredLang as SupportedLang;
    }
  }

  // 3. Default language
  return defaultLang;
}

/**
 * Static: Determine language from URL (for backwards compatibility)
 */
export function getLangFromUrl(url: URL): SupportedLang {
  const hlParam = url.searchParams.get("hl");
  if (hlParam && hlParam in ui) {
    return hlParam as SupportedLang;
  }
  return defaultLang;
}

export function useTranslations(lang: SupportedLang) {
  return function t(key: TranslationKeys): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

/**
 * Generate localized path with query parameter
 */
export function getLocalizedPath(path: string, lang: SupportedLang): string {
  const basePath = path.split("?")[0];
  const cleanPath = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return `${cleanPath}?hl=${lang}`;
}

/**
 * Get alternate language URL
 */
export function getAlternateUrl(
  currentUrl: URL,
  targetLang: SupportedLang
): string {
  const newUrl = new URL(currentUrl);
  newUrl.searchParams.set("hl", targetLang);
  return newUrl.pathname + newUrl.search;
}

export function getAlternateLanguage(
  currentLang: SupportedLang
): SupportedLang {
  return currentLang === "ja" ? "en" : "ja";
}
