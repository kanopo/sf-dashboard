"use client"

import { FC, useEffect, useState } from "react"
import { displayCookieSolution } from "$helpers/cookies"
import CookieBanner from "$components/client/cookie/CookieBanner"
import CookiePreferences from "$components//client/cookie/CookiePreferences"
import { useCookieConsent } from "$stores/cookieConsent"
import { usePartialStore } from "$stores/helpers"

const Cookies: FC = () => {
  const [isServer, setIsServer] = useState<boolean>(true)
  const { preferencesOpen, consent, checkConsent } = usePartialStore(useCookieConsent, ["preferencesOpen", "consent", "checkConsent"])

  useEffect(() => {
    setIsServer(false)
  }, [])

  useEffect(() => {
    if (!isServer) {
      checkConsent()
    }
  }, [isServer])

  if (isServer) {
    return null
  }

  return <>
    {
      consent !== undefined && !consent && !preferencesOpen && displayCookieSolution() && <CookieBanner />
    }
    {
      preferencesOpen && displayCookieSolution() && <CookiePreferences />
    }
  </>
}

export default Cookies
