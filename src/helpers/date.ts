import { leadingZero } from "./format"

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  return `${leadingZero(date.getDate())}/${leadingZero(date.getMonth() + 1)}/${date.getFullYear()}`
}

export const formatHour = (dateString: string): string => {
  const date = new Date(dateString)

  return `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`
}

export const formatDateHour = (dateString: string): string => {
  return `${formatDate(dateString)} - ${formatHour(dateString)}`
}

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
}

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

export const isYesterday = (date: Date): boolean => {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return isSameDay(d, date)
}

export const getHoursDifference = (d1: Date, d2: Date): number => {
  // 36e5 = 60 * 60 * 1000
  return Math.round(Math.abs(d1.getTime() - d2.getTime()) / 36e5)
}
export const getMinutesDifference = (d1: Date, d2: Date): number => {
  // 6e4 = 60 * 1000
  return Math.round(Math.abs(d1.getTime() - d2.getTime()) / 6e4)
}

export const getDateUpdateLabel = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const hourDiff = getHoursDifference(date, now)

  if (hourDiff < 24) {
    if (hourDiff > 0) {
      return `${hourDiff} ${hourDiff === 1 ? "ora" : "ore"} fa`
    }
    const minDiff = getMinutesDifference(date, now)
    return minDiff > 0
      ? `${minDiff} ${minDiff === 1 ? "minuto" : "minuti"} fa`
      : "Adesso"
  }

  if (isYesterday(date)) {
    return `Ieri - ${formatHour(dateString)}`
  }

  return formatDateHour(dateString)
}
