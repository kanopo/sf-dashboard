"use client"

import { useI18n } from "$i18n/client"
import { RouteObject } from "$types/routes"
import { getPath } from "$helpers/routes"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const normalizePath = (path: string): string => path.endsWith("/") ? path : `${path}/`
const isRouteActive = (pathname: string, translatedPath: string): boolean => normalizePath(pathname) === normalizePath(translatedPath)

export const useActiveRouteGroup = (childRoutes: RouteObject[]): boolean => {
  const pathname = usePathname() ?? ""
  const lng = useI18n(({ lng }) => lng)

  const [active, setActive] = useState(childRoutes.some(route => isRouteActive(pathname, getPath({ ...route, lng }))))

  useEffect(() => {
    setActive(childRoutes.some(route => isRouteActive(pathname, getPath({ ...route, lng }))))
  }, [pathname])

  return active
}

export const useActiveRoute = (route: RouteObject): boolean => {
  const pathname = usePathname() ?? ""
  const lng = useI18n(({ lng }) => lng)
  const translatedPath = getPath({ ...route, lng })

  const [active, setActive] = useState(isRouteActive(pathname, translatedPath))

  useEffect(() => {
    setActive(isRouteActive(pathname, translatedPath))
  }, [pathname])

  return active
}
