"use client"

import { useI18n } from "$i18n/client"
import { getPath } from "$helpers/routes"
import { SupportedLanguage } from "$types/i18n"
import { default as NextLink, LinkProps as NextLinkProps } from "next/link"
import React, { AnchorHTMLAttributes, FC, PropsWithChildren } from "react"
import { Href, ReplaceParams } from "$types/routes"

type TLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &  Omit<NextLinkProps, "href" | "locale"> & {
  href: Href
  locale?: SupportedLanguage
  replaceParams?: ReplaceParams
}

const TLink: FC<PropsWithChildren<TLinkProps>> = ({ children, locale, href, replaceParams, ...props }) => {
  const lng = useI18n(({ lng }) => lng)

  return <NextLink href={getPath({ href, lng: locale || lng, replaceParams })} {...props}>
    {children}
  </NextLink>
}

export default TLink
