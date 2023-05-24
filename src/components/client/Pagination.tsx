"use client"

import Icon from "$components/server/Icon"
import usePagination from "$hooks/usePagination"
import styles from "$styles/components/Pagination.module.css"
import { IconName } from "$types/icon"
import classNames from "classnames"
import { FC } from "react"

type Props = {
  current: number
  total: number
  onChange(page: number): void
  className?: string
}

const Pagination: FC<Props> = ({ current, total, onChange, className }) => {
  const { items } = usePagination({
    boundaryCount: 1,
    count: total,
    page: current,
    onChange
  })

  const icons: { [key: string]: IconName } = {
    previous: "chevron-left",
    next: "chevron-right",
    first: "chevron-left",
    last: "chevron-right"
  }

  return (
    <ul className={classNames(styles.container, className)}>
      {items.map(({ page, type, selected, disabled, ...item }, index) =>
        <li
          key={index}
          className={classNames(
            styles.item,
            selected && styles.itemActive,
            (disabled || type === "end-ellipsis" || type === "start-ellipsis") && styles.itemDisabled,
            (type === "previous" || type === "next") && styles.itemRound
          )}
          {...item}
        >
          {(type === "start-ellipsis" || type === "end-ellipsis")
            ? "..."
            : type === "page"
              ? page
              : <Icon name={icons[type]} />
          }
        </li>
      )}
    </ul>
  )
}

export default Pagination
