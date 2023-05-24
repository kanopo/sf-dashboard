import { FC, ReactElement } from "react"
import { Metadata } from "next"
import { SupportedLanguage } from "./i18n"

// TODO, pending NextJS types
export type PageParams = { params: Record<string, string> & { lng: SupportedLanguage } }

// TODO, pending NextJS types
interface AsyncComponent<Props> extends Omit<FC<Props>, "call"> {
  (props: Props): Promise<ReactElement | null>
}

// TODO, pending NextJS types
export type ServerPage<Props = object> = AsyncComponent<Props & PageParams>

// TODO, pending NextJS types
export type GenerateMetadata = (options: PageParams) => Promise<Metadata>
