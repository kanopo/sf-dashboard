"use client"

import { FC, useEffect } from "react"
import { useClientTranslation } from "$i18n/client"

const Error: FC<{
  error: Error
  reset: () => void
}> = ({
  error,
  reset
}) => {
  const { t } = useClientTranslation("common")

  useEffect(() => {
    // TODO: add Sentry
  }, [error])

  return (
    <div>
      <h2>{ t("ERROR.GENERIC_ERROR") }</h2>
      <button onClick={(): void => reset()}>
        { t("ERROR.RETRY_BUTTON") }
      </button>
    </div>
  )
}

export default Error
