import "server-only"

import { FC } from "react"
import classNames from "classnames"
import SVG from "react-inlinesvg"
import styles from "$styles/components/Icon.module.css"
import { IconName } from "$types/icon"

type Props = {
  name: IconName
  className?: string
  size?: number
}

const Icon: FC<Props> = ({ name, className, size = 24 }) => {
  return (
    <SVG
      className={classNames(styles.icon, className)}
      src={`/assets/icons/${name}.svg`}
      cacheRequests
      width={size}
      height={size}
      loader={
        <div className="inline-block" style={{ width: size, height: size }} />
      }
    />
  )
}

export default Icon
