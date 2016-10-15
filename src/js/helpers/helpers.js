import React from 'react';
import _ from 'underscore';

// Update query string given old query object and new object
// Note: not wholesale replacement of query string
// export function updateQueryString(oldQueryObject, key, input, arrayValued=false) {
//   var newQueryObject = { ...oldQueryObject };
//   if (arrayValued) {  // Adding or removing arrays from arrays
//     const oldValues = parseFromQueryObject(oldQueryObject, key, arrayValued);
//     var newValues = oldValues
//     if (!Array.isArray(input)) {
//       input = [ input ];
//     }
//
//     for (let e of input) {
//       if (newValues.indexOf(e) == -1) {
//         newValues.push(e);
//       } else {
//         newValues = oldValues.filter((oldValue) => oldValue !== e);
//       }
//     }
//     newQueryObject[key] = newValues;
//
//   } else {  // Adding or removing single valued keys
//     if (key in oldQueryObject && oldQueryObject[key] == input) {
//       newQueryObject = _.omit(oldQueryObject, key);
//     } else {
//       newQueryObject[key] = input;
//     }
//   }
//   return queryObjectToQueryString(newQueryObject);
// }

export function updateQueryString(oldQueryObject, newState) {
  var newQueryObject = { ...oldQueryObject };

  for (let key in newState) {
    var value = newState[key];
    var arrayValued = Array.isArray(value);

    if (arrayValued) {
      var oldValues = parseFromQueryObject(oldQueryObject, key, arrayValued);
      var newValues = oldValues;
      for (let e of value) {
        if (newValues.indexOf(e) == -1) {
          newValues.push(e);
        } else {
          newValues = oldValues.filter((oldValue) => oldValue !== e);
        }
      }
      newQueryObject[key] = newValues;
    } else {
      if (key in oldQueryObject && oldQueryObject[key] == input) {
        newQueryObject = _.omit(oldQueryObject, key);
      } else {
        newQueryObject[key] = value;
      }
    }
  }
  return queryObjectToQueryString(newQueryObject);
}

export function parseFromQueryObject(queryObject, key, arrayValued=false) {
  if (arrayValued) {
    if (key in queryObject) {
      return queryObject[key].split(',').map((x) => parseInt(x) ? parseInt(x) : x);
    } else {
      return [];
    }
  } else {
    if (key in queryObject) {
      const x = queryObject[key];
      return parseInt(x) ? parseInt(x) : x;
    } else {
      return null;
    }
  }
}

function queryObjectToQueryString(queryObject) {
  var queryString = '';

  Object.keys(queryObject).forEach(
    function (key, index, array) {
      const value = queryObject[key];
      if (typeof value != 'undefined' && value !== null) {
        var fieldString = '';
        if (Array.isArray(value)) {
          if (value.length > 0) {
            fieldString = `&${ key }=${ value.join(',') }`;
          }
        } else {
          fieldString = `&${ key }=${ value }`;
        }
        queryString = queryString + fieldString;
      }
    }
  );
  queryString = queryString.replace('&', '?');
  return queryString;
}

// https://blog.codinghorror.com/sorting-for-humans-natural-sort-order/
// http://web.archive.org/web/20130826203933/http://my.opera.com/GreyWyvern/blog/show.dml/1671288
// http://web.archive.org/web/20130901121931/http://davekoelle.com/alphanum.html
export function naturalSort(a, b) {
  function chunkify(t) {
    t = t.toString()
    var tz = [], x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);

  for (var x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
}

export function getRoundedString(num, decimalPlaces=3, useFixed=false) {
  if (typeof num === 'string' || num instanceof String) {
    return num;
  }
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

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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


// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// http://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
export function useWhiteFontFromBackgroundHex(hex) {
  try {
    var RGB = hexToRgb(hex);
    var { r, g, b } = RGB;

    if (( r * 0.299 + g * 0.587 + b * 0.114 ) > 186) {
      return false
    } else {
      return true
    }
  } catch (e) {
    console.error('Error in useWhiteFontFromBackgroundHex', e);
    return true
  }
}

export function useWhiteFontFromBackgroundRGBString(RGB) {
  var match = RGB.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);

  var r = parseInt(match[1]);
  var g = parseInt(match[2]);
  var b = parseInt(match[3]);

  if (( r * 0.299 + g * 0.587 + b * 0.114 ) > 186) {
    return false
  } else {
    return true
  }
}

export function shift(a, num) {
  var aShifted = a.slice();
  for (var i = num; i; i -= 1) {
    aShifted.push(aShifted.shift());
  }
  return aShifted;
}

export function getFieldColorsPalette(numFieldProperties) {
  const palettes = [
    ['red', '#3366CC', 'green', 'purple'],
    ['#AF0B0B', '#AF550B', '#076969', '#098C09'],
    ['#AA3939', '#226666', '#AA6C39', '#2D882D'],
    ['#F3595C', '#78C466', '#579AD6', '#FCA853', '#9F65AD', '#D07054', '#D97DB5'],
    ["#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059", "#FFDBE5", "#7A4900","#0000A6","#63FFAC","#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300918","#0AA6D8","#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83009","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B"]
  ];

  return _.sample(palettes[4], numFieldProperties);
}

export function getPalette(hashElements) {
  const palettes = [
    ['red', '#3366CC', 'green', 'purple'],
    ['#AF0B0B', '#AF550B', '#076969', '#098C09'],
    ['#AA3939', '#226666', '#AA6C39', '#2D882D'],
    ['#F3595C', '#78C466', '#579AD6', '#FCA853', '#9F65AD', '#D07054', '#D97DB5'],
    ["#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059", "#FFDBE5", "#7A4900","#0000A6","#63FFAC","#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300918","#0AA6D8","#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83009","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B"]
  ];

  const hashBaseArray = hashElements.slice().reduce((prev, curr) => [...prev, ...curr]);

  const hash = hashBaseArray.reduce((prev, curr, i) => i <= 1 ? prev.charCodeAt(0) + curr.charCodeAt(0) : prev + curr.charCodeAt(0));
  const colors = shift(palettes[3], hash % 4);
  return colors;
}

function camelCaseToDash( myStr ) {
  return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

export function createURL(base, queryObj) {
  return Object.keys(queryObj).reduce((prev, curr, index) => {
    const param = camelCaseToDash(curr) + '=' + queryObj[curr];

    if(index === 0) return prev + param;
    return prev + '&' + param;
  }, base + '?')
}

export function recommendRegressionType(dependentVariableType) {
  const dvToType = {
    q: 'linear',
    c: 'logistic',
    t: 'linear'
  }
  return dvToType[dependentVariableType];
}

export function createInteractionTermName(array) {
  return array.reduce((prev, curr, key) => {
    if(key === 0) return curr;
    return prev + ' * ' + curr;
  })
}

export function filterInteractionTermSelection(item, alreadySelectedTerm, interactionTerms) {
  var showVariable = true;
  if(alreadySelectedTerm) {
    for (var i=0; i < interactionTerms.length; i++) {
      if(interactionTerms[i].variables.indexOf(item) > -1 && interactionTerms[i].variables.indexOf(alreadySelectedTerm) > -1){
        showVariable = false;
        break;
      }
    }
  }
  return showVariable;
}

export function formatListWithCommas(li) {
  const numEles = li.length;
  return li.map(function(ele, i) {
    if (i == 0) {
      return <span>{ ele }</span>
    } else if (i > 0 && i < numEles - 1) {
      return <span>, { ele }</span>
    } else {
      return <span> and { ele }</span>
    }
  })
}
