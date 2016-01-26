export function getRoundedString(num, decimalPlaces=3, useFixed=false) {
  const roundedNum = getRoundedNum(num, decimalPlaces, useFixed);
  if (isNaN(roundedNum)) {
    return '';
  }
  return roundedNum.toString();
}

export function getRoundedNum(num, decimalPlaces=3, useFixed=false) {
  if (num != null) {
    return Math.abs(parseFloat(num)) < 1 || useFixed ?
      +parseFloat(num).toFixed(decimalPlaces) :
      +parseFloat(num).toPrecision(decimalPlaces);
  }
  return NaN;
}
