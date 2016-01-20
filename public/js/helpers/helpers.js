export function getRoundedString(num, decimalPlaces=3, useFixed=false) {
  const roundedNum = getRoundedNum(num, decimalPlaces, useFixed);
  if (!roundedNum || roundedNum == NaN) {
    return '';
  }
  return roundedNum.toString();
}

export function getRoundedNum(num, decimalPlaces=3, useFixed=false) {
  if (num) {
    return Math.abs(parseFloat(num)) < 1 || useFixed ?
      +parseFloat(num).toFixed(decimalPlaces) :
      +parseFloat(num).toPrecision(decimalPlaces);
  }
  return NaN;
}
