"use client"

import i18next from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { defaultNS, fallbackLng, i18nOptions } from "./helpers"
import { createContext, PropsWithChildren, useContext, useRef } from "react"
import { createI18nStore, I18nProps, I18nState, I18nStore } from "$stores/i18n"
import { FC } from "react"
import { useStore } from "zustand"
import { Namespace } from "$types/i18n"

void i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...i18nOptions,
    lng: fallbackLng,
    ns: defaultNS
  })

export const useClientTranslation = useTranslation<Namespace>

const I18nContext = createContext<I18nStore | null>(null)

export const I18nContextProvider: FC<PropsWithChildren<I18nProps>> = ({ children, ...props }) => {
  const store = useRef<I18nStore>()

  if (!store.current) {
    store.current = createI18nStore(props)
    store.current.subscribe(({ lng }) => {
      if (i18next.resolvedLanguage !== lng) {
        void i18next.changeLanguage(lng)
      }
    })
  }

  return <I18nContext.Provider value={store.current}>
    {children}
  </I18nContext.Provider>
}

export const useI18n = <T, >(selector: (state: I18nState) => T): T => {
  const store = useContext(I18nContext)
  if (!store) {
    throw new Error("Missing I18nContext.Provider in the tree")
  }

  return useStore(store, selector)
}

