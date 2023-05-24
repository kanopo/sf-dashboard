import { gtagId } from "./env"

const cookiePreferencesConfig = {
  performance: {
    name: "PERFORMANCE_TITLE",
    description: "PERFORMANCE_DESCRIPTION",
    showCategory: (): boolean => {
      return !!gtagId
    }
  },
  necessary: {
    name: "NECESSARY_TITLE",
    description: "NECESSARY_DESCRIPTION",
    order: 0
  }
}

export type CookiePreference = keyof typeof cookiePreferencesConfig
export type CookiePreferences = {
  [key in CookiePreference]: boolean
}
type CookiePreferenceConfig = {
  name: string
  description: string
  order?: number
  showCategory?(): boolean
}
type CookiePreferencesConfig = {
  [key in CookiePreference]: CookiePreferenceConfig
}
export type CookiePreferenceSection = Omit<CookiePreferenceConfig, "order"> & {
  id: CookiePreference
}

const cookiePreferences = cookiePreferencesConfig as CookiePreferencesConfig
const getOrder = (key: CookiePreference): number => {
  return (!isNaN(cookiePreferences[key].order as number) ? cookiePreferences[key].order : 1) as number
}
export const cookiePreferencesSections: CookiePreferenceSection[] = ((Object.keys(cookiePreferences) as CookiePreference[])
  .sort((a: CookiePreference, b: CookiePreference) => {
    return getOrder(a) < getOrder(b) ? -1 : 1
  }) as CookiePreference[])
  .map((id: CookiePreference) => {
    const data = cookiePreferences[id]
    delete data.order
    return {
      id,
      ...data
    }
  })

export const cookiePreferencesKeys: CookiePreference[] = Object.keys(cookiePreferencesConfig) as CookiePreference[]
const setPreferences = (value: boolean): CookiePreferences => {
  return cookiePreferencesKeys
    .filter((key: CookiePreference) => key !== "necessary")
    .reduce((obj: Partial<CookiePreferences>, key: keyof CookiePreferences) => {
      obj[key] = value
      return obj
    }, { necessary: true } as Partial<CookiePreferences>) as CookiePreferences
}
export const defaultCookiesPreferences: CookiePreferences = setPreferences(false)
export const acceptedCookiesPreferences: CookiePreferences = setPreferences(true)
