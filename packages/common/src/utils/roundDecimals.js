export function roundDecimals (number, decimals = 1) {
  const decimalPlacesFactor = Math.pow(10, decimals)
  return Math.round(number * decimalPlacesFactor) / decimalPlacesFactor
}
