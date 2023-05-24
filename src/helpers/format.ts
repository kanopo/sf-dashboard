export const leadingZero = (number: number, digitCount = 2): string => {
  const str = `${number}`
  const diff = digitCount - str.length
  if (diff > 0) {
    let res = str
    for (let i = 0; i < diff; i++) {
      res = `0${res}`
    }
    return res
  }
  return str
}

export const formatPrice = (price: number, currency = "€"): string => {
  return `${(Math.round(price * 100) * 0.01).toFixed(2)} ${currency}`
}