"use client"

import { FC } from "react"
import Button from "$components/client/Button"
import styles from "$styles/components/CookieBanner.module.css"
import { useCookieConsent } from "$stores/cookieConsent"
import { usePartialStore } from "$stores/helpers"
import { useClientTranslation } from "$i18n/client"

const CookieBanner: FC = () => {
  const { acceptCookies, refuseCookies, openPreferences } = usePartialStore(useCookieConsent, ["acceptCookies", "refuseCookies", "openPreferences"])
  const { t } = useClientTranslation("common")

  return (
    <>
      <div className={styles.bg} />

      <div className={styles.box}>
        <div className={styles.content}>
          { t("COOKIE.BANNER_TEXT") }
        </div>

        <div className={styles.buttons}>
          <div className={styles.button}>
            <Button size="full" outline onClick={(): void => refuseCookies({ setCookie: true })}>{t("COOKIE.DECLINE")}</Button>
          </div>

          <div className={styles.button}>
            <Button size="full" outline onClick={(): void => openPreferences()}>{t("COOKIE.CUSTOMIZE")}</Button>
          </div>

          <div className={styles.button}>
            <Button size="full" onClick={(): void => acceptCookies({ setCookie: true })}>{t("COOKIE.ACCEPT_ALL")}</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CookieBanner
