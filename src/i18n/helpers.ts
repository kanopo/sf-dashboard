import { Namespace, SupportedLanguage, Route } from "$types/i18n"
import config from "./config.js"

export const fallbackLng = config.fallbackLng as SupportedLanguage
export const languages = config.languages as SupportedLanguage[]
export const defaultNS = config.defaultNS as Namespace
export const paths = config.paths as Record<Route, Partial<Record<SupportedLanguage, string>>>

export const generateI18nStaticParams = (path: Route) => (): Record<string, string>[] => {
  const out = []
  for (let i = 0; i < languages.length; i++) {
    const lng = languages[i]
    if (path === "/" || paths[path][lng]) {
      out.push({ lng })
    }
  }

  return out
}

export const i18nOptions = {
  supportedLngs: languages,
  fallbackLng,
  fallbackNS: defaultNS,
  defaultNS
}
