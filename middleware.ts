// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from "next/server"
import acceptLanguage from "accept-language"
import { fallbackLng, languages } from "$i18n/helpers"

// config const export cannot be conditional, so we keep the basic auth matcher commented out
// you can uncomment it to enable basic auth
export const config = {
  // matcher: "/((?!api).*)"
  matcher: "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"
}

const i18nCookieName = "NEXT_LOCALE"
const cookieConsentCookieName = "cookie_consent"

export function middleware(req: NextRequest): NextResponse {
  const basicAuth = req.headers.get("authorization")
  const url = req.nextUrl

  // remember to uncomment the matcher above in order to use this
  if (process.env.AUTH_USER && process.env.AUTH_PWD) {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1]
      const [user, pwd] = atob(authValue).split(":")

      if (user !== process.env.AUTH_USER || pwd !== process.env.AUTH_PWD) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Authentication failed" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        )
      }
    } else {
      url.pathname = "/api/auth"

      return NextResponse.rewrite(url)
    }
  }

  if (req.nextUrl.pathname.indexOf("icon") > -1 || req.nextUrl.pathname.indexOf("chrome") > -1) {
    return NextResponse.next()
  }

  let lng
  if (req.cookies.has(i18nCookieName)) {
    lng = acceptLanguage.get(req.cookies.get(i18nCookieName)?.value)
  }
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get("Accept-Language"))
  }
  if (!lng) {
    lng = fallbackLng
  }

  // Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next") &&
    !req.nextUrl.pathname.startsWith("/assets") &&
    req.nextUrl.pathname !== "/sw.js" &&
    req.nextUrl.pathname !== "/favicon.ico"
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer")!)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    let cookieConsent
    try {
      const { value } = req.cookies.get(cookieConsentCookieName) || {}
      if (value) {
        cookieConsent = JSON.parse(value)
      }
    } catch (err) {}

    if (lngInReferer && cookieConsent?.consent && cookieConsent.preferences.necessary) {
      response.cookies.set(i18nCookieName, lngInReferer)
    }
    return response
  }

  return NextResponse.next()
}
