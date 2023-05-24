import { MouseEvent } from "react"

export const stopPropagation = (e: MouseEvent<HTMLElement>): void => {
  e.stopPropagation()
}

export const preventDefault = (e: MouseEvent<HTMLElement>): void => {
  e.preventDefault()
}
