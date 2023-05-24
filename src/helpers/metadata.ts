import { Href, ReplaceParams } from "$types/routes"
import { getPath } from "./routes"
import { languages } from "$i18n/helpers"
import { SupportedLanguage } from "$types/i18n"
import { AlternateURLs } from "next/dist/lib/metadata/types/alternative-urls-types"

export const generateAlternates = ({
  currentLng,
  href,
  replaceParams
}: { currentLng: SupportedLanguage, href: Href, replaceParams?: ReplaceParams }): AlternateURLs => {
  return {
    canonical: getPath({ siteUrlPrefix: true, href, lng: currentLng, replaceParams }),
    languages: languages.reduce<Record<string, string>>((acc, lng) => {
      if (lng !== currentLng) {
        acc[lng] = getPath({ siteUrlPrefix: true, lng, href, replaceParams })
      }

      return acc
    }, {})
  }
}
