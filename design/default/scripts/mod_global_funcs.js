function INIT_GLOBAL_FUNCS() {
  // status: 0b1111 每一位对应： 蓝灯/红灯/黄灯/绿灯
  //
  // flash: 0b1111 每一位对应： 蓝灯/红灯/黄灯/绿灯是否闪烁
  // duration   150ms
  this.setLEDStatus = function (status, flash, duration) {
    if (!duration) {
      duration = 150;
    }
    if (!flash) {
      flash = 0;
    }
    if (!status) {
      status = 0;
    }
    Tos.SysLed(0b1111, 0, 0);
    if (status === 0) {
      Tos.SysLed(0b1111, 0, 0);
    }
    if (status & 0b1000) {
      Tos.SysLed(0x08, flash & 0b1000 ? 2 : 1, flash & 0b1000 ? duration : 0);
    }
    if (status & 0b0100) {
      Tos.SysLed(0x04, flash & 0b0100 ? 2 : 1, flash & 0b0100 ? duration : 0);
    }
    if (status & 0b0010) {
      Tos.SysLed(0x02, flash & 0b0010 ? 2 : 1, flash & 0b0010 ? duration : 0);
    }
    if (status & 0b0001) {
      Tos.SysLed(0x01, flash & 0b0001 ? 2 : 1, flash & 0b0001 ? duration : 0);
    }
  };
  this.setTransactionTime = function (isClear) {
    if (!Tos.GLOBAL_DATA) {
      Tos.GLOBAL_DATA = {};
    }
    if (isClear) {
      Tos.GLOBAL_DATA.currentTransactionTime = null;
      return null;
    } else {
      let ret = Tos.SysGetTime();
      if (ret.code === 0 && ret.data) {
        let year = ret.data.substring(0, 4);
        let mo = ret.data.substring(4, 6);
        let date = ret.data.substring(6, 8);
        let h = ret.data.substring(8, 10);
        let m = ret.data.substring(10, 12);
        let s = ret.data.substring(12, 14);
        Tos.GLOBAL_DATA.currentTransactionTime = {
          year: year,
          month: mo,
          date: date,
          h: h,
          m: m,
          s: s
        };
        return {
          year: year,
          month: mo,
          date: date,
          h: h,
          m: m,
          s: s
        };
      }
      return null;
    }
  };
  this.getTransactionTime = function () {
    if (!Tos.GLOBAL_DATA) {
      Tos.GLOBAL_DATA = {};
    }
    return Tos.GLOBAL_DATA.currentTransactionTime;
  };
}


function GLOBAL_HEXARR_2_STRING(buffer) {
  const hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16).toUpperCase()).slice(-2)
      }
  )
  return hexArr.join('');

}
function GLOBAL_STRING_2_HEXARR(hexStr) {
  let pos = 0;
  let len = hexStr.length;
  if (len % 2 !== 0) {
    return null;
}
  len /= 2;
  let hexArr = [];
  for (let i = 0; i < len; i++) {
    let data = "0x" + hexStr.substr(pos, 2);
    hexArr.push(parseInt(data));
    pos += 2;
  }
  console.log("GLOBAL_STRING_2_HEXARR  ==========>:", hexArr.length,hexArr);
  return hexArr;
}

function GLOBAL_ASCII2HEX(str) {
  if (str === "") {
    return "";
  } else {
    let hexCharCode = [];
    for (let i = 0; i < str.length; i++) {
      hexCharCode.push((str.charCodeAt(i)).toString(16));
    }
    return hexCharCode.join("");
    // return  str.split("").reduce((pre,cur)=>{pre+= cur.charCodeAt().toString(16);return pre;},"");
  }
}
function GLOBAL_HEXARR2STRING(buff) {
  if (!buff) {
    return "";
  }
  let resultStr = [];
  for (let i = 0; i < buff.len; i ++) {
    resultStr.push(String.fromCharCode(buff[i]));
  }
  return resultStr.join("");
}

function GLOBAL_HEX2ASCII(str) {
  let rawStr = str.trim();
  let len = rawStr.length;
  if (len % 2 !== 0) {
    return "";
  }
  let curCharCode;
  let resultStr = [];
  for (let i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }

  return resultStr.join("");
}

function  GET_SHOW_AMOUNT(amount){
  console.log("GET_SHOW_AMOUNT input ==========>:", amount);
  if(!amount){
    return "0.00"
  }
  let amt  = parseInt(amount);
  let data = (amt/100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  console.log("GET_SHOW_AMOUNT  amt) ==========>:", data);
  return data;
}

function  SHOW_MASK_CARD(pan){
  console.log("SHOW_MASK_CARD pan ==========>:", pan);
  if(!pan || pan.length<12){
    return "**********"
  }
  let card = "";
  card += pan.substring(0, 6);
  let startLen  =  pan.length-10;
  card += "****************".substr(0,startLen);
  card += pan.substring(pan.length - 4, pan.length);
  console.log("SHOW_MASK_CARD   ==========>:", card);
  return card;
}

function sprintf() {
  const regex = /%%|%(?:(\d+)\$)?((?:[-+#0 ]|'[\s\S])*)(\d+)?(?:\.(\d*))?([\s\S])/g
  const args = arguments
  let i = 0
  const format = args[i++]
  const _pad = function (str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' '
    }
    const padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr);
    return leftJustify ? str + padding : padding + str;
  }
  const justify = function (value, prefix, leftJustify, minWidth, padChar) {
    const diff = minWidth - value.length
    if (diff > 0) {
      // when padding with zeros
      // on the left side
      // keep sign (+ or -) in front
      if (!leftJustify && padChar === '0') {
        value = [
          value.slice(0, prefix.length),
          _pad('', diff, '0', true),
          value.slice(prefix.length)
        ].join('');
      } else {
        value = _pad(value, minWidth, padChar, leftJustify);
      }
    }
    return value;
  }
  const _formatBaseX = function (value, base, leftJustify, minWidth, precision, padChar) {
    // Note: casts negative numbers to positive ones
    const number = value >>> 0
    value = _pad(number.toString(base), precision || 0, '0', false)
    return justify(value, '', leftJustify, minWidth, padChar)
  }
  // _formatString()
  const _formatString = function (value, leftJustify, minWidth, precision, customPadChar) {
    if (precision !== null && precision !== undefined) {
      value = value.slice(0, precision)
    }
    return justify(value, '', leftJustify, minWidth, customPadChar);
  }
  // doFormat()
  const doFormat = function (substring, argIndex, modifiers, minWidth, precision, specifier) {
    let number, prefix, method, textTransform, value
    if (substring === '%%') {
      return '%'
    }
    // parse modifiers
    let padChar = ' ' // pad with spaces by default
    let leftJustify = false
    let positiveNumberPrefix = ''
    let j, l
    for (j = 0, l = modifiers.length; j < l; j++) {
      switch (modifiers.charAt(j)) {
        case ' ':
        case '0':
          padChar = modifiers.charAt(j);
          break;
        case '+':
          positiveNumberPrefix = '+';
          break;
        case '-':
          leftJustify = true;
          break;
        case "'":
          if (j + 1 < l) {
            padChar = modifiers.charAt(j + 1);
            j++;
          }
          break
      }
    }
    if (!minWidth) {
      minWidth = 0;
    } else {
      minWidth = +minWidth
    }
    if (!isFinite(minWidth)) {
      throw new Error('Width must be finite')
    }
    if (!precision) {
      precision = (specifier === 'd') ? 0 : 'fFeE'.indexOf(specifier) > -1 ? 6 : undefined;
    } else {
      precision = +precision;
    }
    if (argIndex && +argIndex === 0) {
      throw new Error('Argument number must be greater than zero');
    }
    if (argIndex && +argIndex >= args.length) {
      throw new Error('Too few arguments');
    }
    value = argIndex ? args[+argIndex] : args[i++];
    switch (specifier) {
      case '%':
        return '%'
      case 's':
        return _formatString(value + '', leftJustify, minWidth, precision, padChar);
      case 'c':
        return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, padChar);
      case 'b':
        return _formatBaseX(value, 2, leftJustify, minWidth, precision, padChar);
      case 'o':
        return _formatBaseX(value, 8, leftJustify, minWidth, precision, padChar);
      case 'x':
        return _formatBaseX(value, 16, leftJustify, minWidth, precision, padChar);
      case 'X':
        return _formatBaseX(value, 16, leftJustify, minWidth, precision, padChar).toUpperCase();
      case 'u':
        return _formatBaseX(value, 10, leftJustify, minWidth, precision, padChar);
      case 'i':
      case 'd':
        number = +value || 0;
        // Plain Math.round doesn't just truncate
        number = Math.round(number - number % 1);
        prefix = number < 0 ? '-' : positiveNumberPrefix;
        value = prefix + _pad(String(Math.abs(number)), precision, '0', false);
        if (leftJustify && padChar === '0') {
          // can't right-pad 0s on integers
          padChar = ' ';
        }
        return justify(value, prefix, leftJustify, minWidth, padChar);
      case 'e':
      case 'E':
      case 'f': // @todo: Should handle locales (as per setlocale)
      case 'F':
      case 'g':
      case 'G':
        number = +value;
        prefix = number < 0 ? '-' : positiveNumberPrefix;
        method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(specifier.toLowerCase())];
        textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(specifier) % 2];
        value = prefix + Math.abs(number)[method](precision);
        return justify(value, prefix, leftJustify, minWidth, padChar)[textTransform]();
      default:
        // unknown specifier, consume that char and return empty
        return '';
    }
  }
  try {
    return format.replace(regex, doFormat);
  } catch (err) {
    return false;
  }
}

exports.GLOBAL_FUNCS = new INIT_GLOBAL_FUNCS();
exports.GLOBAL_HEXARR_2_STRING = GLOBAL_HEXARR_2_STRING;
exports.GLOBAL_STRING_2_HEXARR = GLOBAL_STRING_2_HEXARR;
exports.GLOBAL_ASCII2HEX = GLOBAL_ASCII2HEX;
exports.GLOBAL_HEX2ASCII = GLOBAL_HEX2ASCII;
exports.GET_SHOW_AMOUNT = GET_SHOW_AMOUNT;
exports.SHOW_MASK_CARD = SHOW_MASK_CARD;
exports.sprintf = sprintf;
exports.GLOBAL_HEXARR2STRING = GLOBAL_HEXARR2STRING;



