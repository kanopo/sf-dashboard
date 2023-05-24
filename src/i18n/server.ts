import { createInstance, i18n } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { TFunction } from "next-i18next"
import { initReactI18next } from "react-i18next/initReactI18next"
import { Namespace, SupportedLanguage } from "$types/i18n"
import { i18nOptions } from "./helpers"

export const getServerTranslations = async(
  lng: SupportedLanguage,
  ns: Namespace | Namespace[] = "common",
  options: { keyPrefix?: string } = {}
): Promise<{
  t: TFunction
  i18n: i18n
}> => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init({
      ...i18nOptions,
      lng,
      ns
    })

  return {
    t: i18nInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nInstance
  }
}
