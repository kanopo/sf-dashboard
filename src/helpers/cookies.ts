"use client"

import { CookiePreference, CookiePreferences, cookiePreferencesSections, defaultCookiesPreferences } from "$constants/cookies"

// generic helpers
export const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

export const setCookie = (name: string, value: string, days?: number): void => {
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = "; expires=" + date.toUTCString()
  }
  document.cookie = `${name}=${value}${expires}; path=/`
}

export const deleteCookie = (name: string): void => {
  setCookie(name, "", -1)
}

// consent helpers
export const setConsentCookie = (consent: boolean, preferences: Partial<CookiePreferences>): void => {
  setCookie("cookie_consent", JSON.stringify({
    consent,
    preferences: {
      ...defaultCookiesPreferences,
      ...preferences
    }
  }), 365)
}
export const filterPreferences = (preferences?: CookiePreferences): Partial<CookiePreferences> => {
  return preferences
    ? (Object.keys(preferences) as CookiePreference[]).reduce((obj: Partial<CookiePreferences>, key: keyof CookiePreferences) => {
      if (key in defaultCookiesPreferences) {
        obj[key] = preferences[key]
      }
      return obj
    }, {} as Partial<CookiePreferences>)
    : {}
}
export const displayCookieSolution = (): boolean => {
  return cookiePreferencesSections
    .filter(({ id }) => id !== "necessary")
    .some(({ showCategory }) => showCategory?.() ?? true)
}
