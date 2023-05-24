import { ReactEventHandler } from "react"

type UsePaginationProps = {
  boundaryCount?: number
  count?: number
  disabled?: boolean
  hideNextButton?: boolean
  hidePrevButton?: boolean
  onChange?(page: number): void
  page: number
  showFirstButton?: boolean
  showLastButton?: boolean
  siblingCount?: number
}

export type UsePaginationItemType = "page" | "first" | "last" | "next" | "previous" | "start-ellipsis" | "end-ellipsis"

type UsePaginationItem = {
  onClick: ReactEventHandler
  type: UsePaginationItemType
  page: number
  selected: boolean
  disabled: boolean
}

export default function usePagination(props: UsePaginationProps): { items: UsePaginationItem[] } {
  const {
    boundaryCount = 1,
    count = 1,
    disabled = false,
    hideNextButton = false,
    hidePrevButton = false,
    onChange: handleChange,
    page,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1
  } = props

  const handleClick = (value: number): void => {
    if (handleChange) {
      handleChange(value)
    }
  }

  // https://dev.to/namirsab/comment/2050
  const range = (start: number, end: number): number[] => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1
    ),
    // Greater than startPages
    boundaryCount + 2
  )

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  )

  const itemList = [
    ...(showFirstButton ? ["first"] : []),
    ...(hidePrevButton ? [] : ["previous"]),
    ...startPages,

    // Start ellipsis
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    ...(siblingsEnd < count - boundaryCount - 1
      ? ["end-ellipsis"]
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : ["next"]),
    ...(showLastButton ? ["last"] : [])
  ] as Array<UsePaginationItemType | number>

  // Map the button type to its page number
  const buttonPage = (type: UsePaginationItemType): number | null => {
    switch (type) {
      case "first":
        return 1
      case "previous":
        return Math.max(page - 1, 1)
      case "next":
        return Math.min(page + 1, count)
      case "last":
        return count
      default:
        return null
    }
  }

  const items = itemList.map((item: UsePaginationItemType | number) => {
    return typeof item === "number"
      ? {
        onClick: (): void => {
          if (item !== page) {
            handleClick(item)
          }
        },
        type: "page",
        page: item,
        selected: item === page,
        disabled
      }
      : {
        onClick: (): void => {
          const itemPage = buttonPage(item)
          if (itemPage !== null && itemPage !== page) {
            handleClick(itemPage)
          }
        },
        type: item,
        page: buttonPage(item),
        selected: false,
        disabled:
          disabled ||
          (item.indexOf("ellipsis") === -1 &&
            (item === "next" || item === "last" ? page >= count : page <= 1))
      }
  }) as UsePaginationItem[]

  return {
    items
  }
}