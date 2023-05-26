import "server-only"

import { notFound } from "next/navigation"
import { ServerPage } from "$types/next"
import { generateI18nStaticParams } from "$i18n/helpers"

export const generateStaticParams = generateI18nStaticParams("/")

const Page: ServerPage = async() => {
  notFound()

  return null
}

export default Page
