/* eslint-disable no-console */
import { ApiError } from "$helpers/errors"
import { toast } from "react-toastify"
import { useClientTranslation } from "$i18n/client"

// key: error.code
type HandleErrorOverride = {
  [key: string]: ((err: ApiError) => void) | null
}
type HandleErrorOptions = {
  codes?: HandleErrorOverride
}

type UseError = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(err: any, options?: HandleErrorOptions): void
}

const useError = (): UseError => {
  const { t } = useClientTranslation("common")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (err: any, options?: HandleErrorOptions): void => {
    if (err.body) {
      const apiError = err.body as ApiError
      console.warn("API error", apiError)

      let message: string
      if (apiError) {
        if (options?.codes && apiError.error.code && apiError.error.code in options.codes) {
          if (options.codes[apiError.error.code] !== null) {
            options.codes[apiError.error.code]!(apiError)
          }
          return
        }

        message = apiError.error.code ? t(`API_ERROR.${apiError.error.code}`) : apiError.error.message || apiError.statusCode
        toast.error(message)

        if (apiError.error.code === "EXPIRED_JWT") {
          // logout
        }
      }

    } else {
      console.error("CODE error", err)
      toast.error("Si è verificato un errore inaspettato")
    }
  }

  return {
    handleError
  }
}

export default useError
