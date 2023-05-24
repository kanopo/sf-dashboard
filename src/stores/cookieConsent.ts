import { acceptedCookiesPreferences, CookiePreferences, defaultCookiesPreferences } from "$constants/cookies"
import { deleteCookie, filterPreferences, getCookie, setConsentCookie } from "$helpers/cookies"
import { create } from "zustand"

type CommonCookiesOptions = {
  setCookie?: boolean
}
type AcceptCookiesOptions = CommonCookiesOptions & {
  preferences?: CookiePreferences
}
type RefuseCookiesOptions = CommonCookiesOptions
type ResetCookiesOptions = CommonCookiesOptions
type UpdateCookiePreferencesOptions = {
  preferences: CookiePreferences
  reload?: boolean
}

type CookieConsentStore = {
  consent?: boolean | null
  preferences?: CookiePreferences
  checkConsent(): void
  acceptCookies(options?: AcceptCookiesOptions): void
  refuseCookies(options?: RefuseCookiesOptions): void
  resetCookies(options?: ResetCookiesOptions): void

  preferencesOpen: boolean
  openPreferences(): void
  closePreferences(): void
}

export const useCookieConsent = create<CookieConsentStore>((set, get) => ({
  consent: undefined,
  preferences: undefined,
  checkConsent: (): void => {
    const store = get()
    const cookieValue = getCookie("cookie_consent")

    if (cookieValue) {
      try {
        const value = JSON.parse(cookieValue) as Pick<CookieConsentStore, "consent" | "preferences">

        if (value) {
          if (value.consent) {
            store.acceptCookies({ preferences: value.preferences })
          } else {
            store.refuseCookies()
          }
        } else {
          store.resetCookies()
        }
      } catch {
        store.resetCookies()
      }
    } else {
      store.resetCookies()
    }
  },
  acceptCookies: (options?: AcceptCookiesOptions): void => {
    const preferences = {
      ...acceptedCookiesPreferences,
      ...filterPreferences(options?.preferences)
    }

    if (options?.setCookie) {
      setConsentCookie(true, preferences)
      window.location.reload()
      return
    }

    set({
      consent: true,
      preferences
    })
  },
  refuseCookies: (options?: RefuseCookiesOptions): void => {
    if (options?.setCookie) {
      setConsentCookie(false, defaultCookiesPreferences)
    }

    set({
      consent: false,
      preferences: { ...defaultCookiesPreferences }
    })
  },
  resetCookies: (options?: ResetCookiesOptions): void => {
    if (options?.setCookie) {
      deleteCookie("cookie_consent")
    }

    set({ consent: null })
  },
  updateCookiePreferences: (options: UpdateCookiePreferencesOptions): void => {
    const store = get()
    const prevConsent = store.consent
    const newPreferences = {
      ...store.preferences || {},
      ...options.preferences
    }
    const newConsent = store.consent || Object.values(newPreferences).reduce((tot, accepted) => tot + +accepted, 0) > 1
    setConsentCookie(newConsent, newPreferences)

    if (prevConsent !== newConsent) {
      window.location.reload()
      return
    }

    set({
      consent: newConsent,
      preferences: newPreferences
    })
  },
  preferencesOpen: false,
  openPreferences: (): void => {
    set({ preferencesOpen: true })
  },
  closePreferences: (): void => {
    set({ preferencesOpen: false })
  }
}))
