"use client"

import { FC, PropsWithChildren } from "react"
import { SupportedLanguage } from "$types/i18n"
import TLink from "./TLink"
import { useI18n } from "$i18n/client"

type Props = {
  locale: SupportedLanguage
  className?: string
}

export const LanguageSwitch: FC<PropsWithChildren<Props>> = ({
  children,
  locale,
  className
}) => {
  const setLng = useI18n(({ setLng }) => setLng)
  return <TLink
    href={"/"}
    locale={locale}
    className={className}
    onClick={(): void => setLng(locale)}
  >
    {children}
  </TLink>
}

export default LanguageSwitch
