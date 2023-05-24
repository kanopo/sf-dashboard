"use client"

import classNames from "classnames"
import { FC, MouseEvent, ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
  email: string
}

const MailTo: FC<Props> = ({
  children,
  className,
  email
}) => {
  const onClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    window.open(`mailto:${email}`, "_blank", "noreferrer")
  }

  return (
    <span className={classNames("cursor-pointer", className)} onClick={onClick}>{children}</span>
  )
}

export default MailTo
