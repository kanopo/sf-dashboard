export type ApiError = {
  error: {
    code?: string
    message: string
  }
  status: number
  statusCode: string
}

type GetErrorOptions = {
  code: string
  message: string
  statusCode?: string
  status?: number
}
export const generateApiError = ({ code, message, status, statusCode }: GetErrorOptions): { body: ApiError } => ({
  body: {
    error: {
      code,
      message
    },
    status: status || 500,
    statusCode: statusCode || "KO"
  }
})
