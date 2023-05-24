"use client"

import { FC, useEffect, useRef } from "react"
import Script from "next/script"
import useGoogleAuth from "$stores/googleAuth"
import { gsiId } from "$constants/env"

const GoogleButton: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const saveToken = useGoogleAuth((state) => state.onAccess)

  const initGoogle = (): void => {
    if (gsiId) {
      try {
        window.google.accounts.id.initialize({
          client_id: gsiId,
          callback: (res) => {
            saveToken(res.credential)
          }
        })

        if (ref.current) {
          window.google.accounts.id.renderButton(ref.current, {
            type: "standard"
          })
        }
      } catch {}
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && ref.current) {
      initGoogle()
    }
  }, [])

  if (gsiId) {
    return (
      <>
        <Script src="https://accounts.google.com/gsi/client" onLoad={initGoogle} strategy="lazyOnload"/>
        <div ref={ref} />
      </>
    )
  }

  return null
}

export default GoogleButton
