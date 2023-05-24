"use client"

import { createRef, FC, RefObject, useEffect, useRef } from "react"
import { CookiePreference, CookiePreferences as CookiePreferencesObject, cookiePreferencesSections } from "$constants/cookies"
import Button from "$components/client/Button"
import CookieAccordion, { CookieAccordionRef } from "$components/client/cookie/CookieAccordion"
import { useCookieConsent } from "$stores/cookieConsent"
import styles from "$styles/components/CookiePreferences.module.css"
import { usePartialStore } from "$stores/helpers"
import { useClientTranslation } from "$i18n/client"

const CookiePreferences: FC = () => {
  const refs = useRef<RefObject<CookieAccordionRef>[]>(new Array(cookiePreferencesSections.length).fill(null).map(() => createRef<CookieAccordionRef>()))

  const { consent, preferences, acceptCookies, refuseCookies, closePreferences } = usePartialStore(useCookieConsent, ["consent", "preferences", "acceptCookies", "refuseCookies", "closePreferences"])
  const { t } = useClientTranslation("common")

  const onRefuse = (): void => {
    refuseCookies({ setCookie: !!consent })
    closePreferences()
  }

  const onAcceptSelected = (): void => {
    const newPreferences = refs.current.reduce((obj: CookiePreferencesObject, ref: RefObject<CookieAccordionRef>) => {
      if (ref.current) {
        obj[ref.current.getId()] = ref.current.getValue()
      }
      return obj
    }, {} as CookiePreferencesObject)

    if (preferences && (Object.keys(newPreferences) as CookiePreference[]).every((key: CookiePreference) => preferences[key] === newPreferences[key])) {
      closePreferences()
    } else {
      acceptCookies({ setCookie: true, preferences: newPreferences })
    }
  }

  const onAcceptAll = (): void => {
    const setCookie = !consent || !preferences || (preferences &&
      (Object.keys(preferences) as CookiePreference[]).some(key => !preferences[key])
    )
    acceptCookies({ setCookie })
    if (!setCookie) {
      closePreferences()
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"

    return (): void => {
      document.body.removeAttribute("style")
    }
  }, [])

  return (
    <>
      <div className={styles.bg} />

      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>{t("COOKIE.PREFERENCES_TITLE")}</div>
        </div>

        <div className={styles.body}>
          <div className={styles.description}>
            { t("COOKIE.PREFERENCES_DESCRIPTION") }
          </div>

          <div className={styles.accordions}>
            {cookiePreferencesSections.map(({ id, name, description }, i) => (
              <CookieAccordion
                key={id}
                id={id}
                title={name}
                description={description}
                defaultValue={preferences?.[id] || id === "necessary"}
                editable={id !== "necessary"}
                ref={refs.current[i]}
              />
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.button}>
            <Button size="full" outline onClick={onRefuse}>{t("COOKIE.DECLINE")}</Button>
          </div>
          <div className={styles.button}>
            <Button size="full" outline onClick={onAcceptSelected}>{t("COOKIE.ACCEPT_SELECTED")}</Button>
          </div>
          <div className={styles.button}>
            <Button size="full" onClick={onAcceptAll}>{t("COOKIE.ACCEPT_ALL")}</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CookiePreferences
