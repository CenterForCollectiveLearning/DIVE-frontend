export function getRoundedString(num, decimalPlaces=3, useFixed=false) {
  const roundedNum = getRoundedNum(num, decimalPlaces, useFixed);
  if (roundedNum == NaN) {
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

export function shuffle(a) {
  var j, x, i, aShuffled;
  aShuffled = a.slice();
  for (i = aShuffled.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = aShuffled[i - 1];
    aShuffled[i - 1] = aShuffled[j];
    aShuffled[j] = x;
  }
  return aShuffled;
}

export function shift(a, num) {
  var aShifted = a.slice();
  for (var i = num; i; i -= 1) {
    aShifted.push(aShifted.shift());
  }
  return aShifted;
}
