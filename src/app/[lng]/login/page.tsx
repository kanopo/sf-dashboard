import "server-only"

import GoogleButton from "$components/client/auth/GoogleButton"
import { generateI18nStaticParams } from "$i18n/helpers"
import { GenerateMetadata, ServerPage } from "$types/next"
import { getServerTranslations } from "$i18n/server"
import { getPath } from "$helpers/routes"
import { generateAlternates } from "$helpers/metadata"

export const generateStaticParams = generateI18nStaticParams("/login")

const Login: ServerPage = async() => {
  return (
    <div className="container my-4">
      <GoogleButton />
    </div>
  )
}

export default Login

export const generateMetadata: GenerateMetadata = async({ params: { lng: currentLng } }) => {
  const { t } = await getServerTranslations(currentLng, ["login", "common"])
  const href = "/login"

  return {
    title: t("META.TITLE"),
    description: t("META.DESCRIPTION"),
    openGraph: {
      title: t("META.TITLE") || undefined,
      description: t("META.DESCRIPTION") || undefined,
      siteName: t("META.SITE_NAME") || undefined,
      url: getPath({ siteUrlPrefix: true, href, lng: currentLng })
    },
    twitter: {
      creator: t("META.TWITTER_CREATOR") || undefined,
      title: t("META.TITLE") || undefined,
      description: t("META.DESCRIPTION") || undefined
    },
    alternates: generateAlternates({ currentLng, href })
  }
}
