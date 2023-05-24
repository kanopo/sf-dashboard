import { paths } from "$i18n/helpers"
import { Route, SupportedLanguage } from "$types/i18n"
import { Href, ReplaceParams } from "$types/routes"
import { siteUrl } from "$constants/env"

export const getPath = ({
  href,
  lng,
  siteUrlPrefix = false,
  replaceParams
}: { href: Href, lng: SupportedLanguage, siteUrlPrefix?: boolean, replaceParams?: ReplaceParams }): string => {
  const [pathname, search] = href.split("?") as [Route, string | undefined]
  const translatedPath = pathname === "/" ? pathname : paths[pathname]?.[lng]

  if (!translatedPath) {
    throw new Error(`Path ${pathname} not found for language ${lng}`)
  }

  let out = `${siteUrlPrefix ? siteUrl : ""}/${lng}${translatedPath}`

  if (replaceParams) {
    Object.entries(replaceParams).forEach(([key, value]) => {
      out = out.replace(new RegExp(`\\:${key}`, "g"), typeof value === "number" ? value.toString() : value)
    })
  }

  if (search) {
    out += `?${search}`
  }

  return out
}
