"use client"

import { FC, HTMLProps, ReactNode } from "react"
import styles from "$styles/components/Button.module.css"
import classNames from "classnames"

export interface Props extends Omit<HTMLProps<HTMLButtonElement>, "size"> {
  children: ReactNode
  outline?: boolean
  size?: "auto" | "full"
  type?:  "button" | "submit" | "reset"
}

const Button: FC<Props> = ({
  children,
  className,
  size = "auto",
  outline,
  ...props
}) => {
  return (
    <button
      className={
        classNames(className,
          styles.button,
          size === "full" && styles.full,
          outline && styles.outline,
          props.disabled && styles.disabled
        )
      }
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
