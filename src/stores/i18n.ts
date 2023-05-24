import { createStore, StoreApi } from "zustand"
import { SupportedLanguage } from "$types/i18n"
import i18next from "i18next"

export interface I18nProps {
  lng: SupportedLanguage
}

export interface I18nState extends I18nProps {
  setLng: (language: SupportedLanguage) => void
}

export type I18nStore = ReturnType<typeof createI18nStore>

export const createI18nStore = ({ lng }: I18nProps): StoreApi<I18nState> => {
  void i18next.changeLanguage(lng)
  return createStore<I18nState>()((set) => ({
    lng,
    setLng: (lng) => set({ lng })
  }))
}
