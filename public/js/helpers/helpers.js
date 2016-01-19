export function getRoundedString(num, decimalPlaces=3, useFixed=false) {
  if (num) {
    return Math.abs(parseFloat(num)) < 1 || useFixed ?
      +parseFloat(num).toFixed(decimalPlaces) :
      +parseFloat(num).toPrecision(decimalPlaces);
  }

  return '';
}
