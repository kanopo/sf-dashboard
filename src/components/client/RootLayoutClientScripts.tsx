"use client"

import { FC, PropsWithChildren } from "react"
import { usePartialStore } from "$stores/helpers"
import { useCookieConsent } from "$stores/cookieConsent"
import { gtagId } from "$constants/env"
import { PageParams } from "$types/next"

const RootLayoutClientScripts: FC<PropsWithChildren<PageParams>> = () => {
  const { consent, preferences } = usePartialStore(useCookieConsent, ["consent", "preferences"])

  if (!!gtagId && consent && preferences?.performance) {
    return <div>
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtagId} <https://www.googletagmanager.com/ns.html?id=${gtagId}> `} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
      </noscript>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
      />

      <script
        id="gtag-script"
      >
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtagId}');`}
      </script>
    </div>
  }

  return null
}

export default RootLayoutClientScripts
