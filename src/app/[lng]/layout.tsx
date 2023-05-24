import "server-only"

import "$styles/globals.css"
import { dir } from "i18next"
import Navbar from "$components/server/Navbar"
import { FC, PropsWithChildren } from "react"
import Footer from "$components/server/Footer"
import Cookies from "$components/client/cookie/Cookies"
import { I18nContextProvider } from "$i18n/client"
import { getPath } from "$helpers/routes"
import { generateAlternates } from "$helpers/metadata"
import { GenerateMetadata, PageParams } from "$types/next"
import { getServerTranslations } from "$i18n/server"
import RootLayoutClientScripts from "$components/client/RootLayoutClientScripts"

const RootLayout: FC<PropsWithChildren<PageParams>> = ({ children, params }) => {
  const { lng } = params

  return (
    <html lang={lng} dir={dir(lng)}>
      <body>
        <I18nContextProvider lng={lng}>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <Cookies />
        </I18nContextProvider>
        <RootLayoutClientScripts params={params} />
      </body>
    </html>
  )
}

export default RootLayout

export const generateMetadata: GenerateMetadata = async({ params: { lng: currentLng } }) => {
  const { t } = await getServerTranslations(currentLng, ["index", "common"])
  const href = "/"

  return {
    title: t("META.TITLE"),
    icons: ["/favicon.ico"],
    themeColor: "#000000",
    description: t("META.DESCRIPTION"),
    openGraph: {
      title: t("META.TITLE") || undefined,
      description: t("META.DESCRIPTION") || undefined,
      type: "website",
      images: ["/logo.jpg"],
      siteName: t("META.SITE_NAME") || undefined,
      url: getPath({ siteUrlPrefix: true, href, lng: currentLng })
    },
    twitter: {
      card: "summary",
      creator: t("META.TWITTER_CREATOR") || undefined,
      title: t("META.TITLE") || undefined,
      description: t("META.DESCRIPTION") || undefined,
      images: ["/logo.png"]
    },
    alternates: generateAlternates({ currentLng, href })
  }
}
