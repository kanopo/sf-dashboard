import { Route } from "$types/i18n"

export type Href = Route | `${Route}?${string}`

export type ReplaceParams = Record<string, string | number>

export type RouteObject = { href: Href, replaceParams?: ReplaceParams }
