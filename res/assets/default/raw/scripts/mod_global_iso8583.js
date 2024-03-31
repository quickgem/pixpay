/******************************/
/*
[bit, length, fix_len]
fix_len = 0, fix length
fix_len = 1, dynamic length
*/

/******************************/
var GLOBAL_STRING_2_HEXARR = require("mod_global_funcs").GLOBAL_STRING_2_HEXARR;


function ISO8583() {
    this.generalConfig = {
        1: ['b', 16, 0],        // 第1域 --  bitmap长度16字节
        2: ['n', 19, 1],       // 第2域  -- 卡号长度最长19字节
        3: ['n', 6, 0],         // 第3域  -- 处理码长度6字节
        4: ['n', 12, 0],        // 第4域  -- 金额长度12字节
        5: ['n', 12, 0],        // 第5域  -- No use
        6: ['n', 12, 0],        // 第6域  -- No use
        7: ['an', 10, 0],       // 第7域  -- No use
        8: ['n', 8, 0],         // 第8域  -- No use
        9: ['n', 8, 0],         // 第8域  -- No use
        10: ['n', 8, 0],        // 第8域  -- No use
        11: ['n', 6, 0],        // 第11域 -- 流水号长度12字节
        12: ['n', 6, 0],        // 第12域 -- 交易时间6字节(HHMMSS)
        13: ['n', 4, 0],        // 第13域 -- 交易日期4字节(MMDD)
        14: ['n', 4, 0],        // 第14域 -- 卡有效期4字节
        15: ['n', 4, 0],        // 第15域 -- 结算日期4字节
        16: ['n', 4, 0],        // 第16域 -- No use
        17: ['n', 4, 0],        // 第17域 -- No use
        18: ['n', 4, 0],        // 第18域 -- No use
        19: ['n', 3, 0],        // 第19域 -- No use
        20: ['n', 3, 0],        // 第20域 -- No use
        21: ['n', 3, 0],        // 第21域 -- No use
        22: ['n', 3, 0],        // 第22域 -- 服务点输入方式4字节(采用左对齐方式,填充时最后一个字节补0)
        23: ['n', 3, 0],        // 第23域 -- IC卡卡序列号4字节(采用左对齐方式,填充时最后一个字节补0)
        24: ['n', 3, 0],        // 第24域 -- NII 3字节
        25: ['n', 2, 0],        // 第25域 -- 服务点条件码2字节
        26: ['n', 2, 0],        // 第26域 -- 服务点PIN获取码2字节
        27: ['n', 1, 0],        // 第27域 --
        28: ['n', 8, 0],        // 第28域 --
        29: ['an', 9, 0],       // 第29域 --
        30: ['n', 8, 0],        // 第30域 --
        31: ['an', 9, 0],       // 第31域 --
        32: ['n', 11, 1],       // 第32域 -- 受理机构标识码11字节
        33: ['n', 11, 1],       // 第33域 --
        34: ['an', 28, 1],      // 第34域 --
        35: ['z', 37, 1],       // 第35域 -- 二磁道数据37字节
        36: ['z', 104, 1],      // 第36域 -- 三磁道数据104字节
        37: ['an', 12, 0],      // 第37域 -- 系统参考号12字节
        38: ['an', 6, 0],       // 第38域 -- 系统授权码6字节
        39: ['an', 2, 0],       // 第39域 -- 系统应答码2字节
        40: ['an', 3, 0],       // 第40域 --
        41: ['ans', 8, 0],      // 第41域 -- 终端号8字节
        42: ['ans', 15, 0],     // 第42域 -- 商户号15字节
        43: ['ans', 40, 0],     // 第43域 -- 商户名称
        44: ['an', 25, 1],      // 第44域 -- 附加响应数据25字节
        45: ['an', 76, 1],      // 第45域 --
        46: ['an', 999, 1],     // 第46域 --
        47: ['an', 999, 1],     // 第47域 --
        48: ['ans', 119, 1],    // 第48域 --
        49: ['an', 3, 0],       // 第49域 -- 交易货币代码3字节
        50: ['an', 3, 0],       // 第50域 --
        51: ['a', 3, 0],        // 第51域 --
        52: ['b', 8, 0],        // 第52域 -- 个人标识码数据(pin)8字节
        53: ['an', 16, 0],      // 第53域 -- 安全控制信息16字节
        54: ['an', 40, 0],      // 第54域 -- 余额相关数据20字节
        55: ['b', 999, 1],    // 第55域 -- IC卡数据域701字节(纯IC卡交易长度可以定义255，701的长度为了电子签名交易需求)
        56: ['ans', 999, 1],    // 第56域 -- 转入方信息
        57: ['ans', 999, 1],    // 第57域 -- 自定义域100字节，包括其他终端参数, 海科融通增加到600
        58: ['ans', 999, 1],    // 第58域 --
        59: ['ans', 99, 1],     // 第59域 -- 自定义域600字节，包括其他终端参数
        60: ['n', 999, 1],     // 第60域 -- 自定义域30字节
        61: ['n', 999, 1],     // 第61域 -- 原始交易数据信息29字节
        62: ['ans', 999, 1],    // 第62域 -- 自定义域
        63: ['ans', 999, 1],    // 第63域 -- 自定义域
        64: ['b', 8, 0],       // 第64域 -- mac数据8字节
    };

    this.fields = [];
    this.values = [];
    this.getMaxField = 0;
    this.segment1 = [0, 0];
    this.segment2 = [0, 0];
    this.segment3 = [0, 0];
    this.msgType = "0000";
    this.tpdu = "";
    this.head = "";

    this._onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    };

    this._arrayUnique = function (arrInput) {
        if (typeof this._arrayUnique == 'object') {
            return arrInput.filter($this._onlyUnique);
        }
        return arrInput;
    };

    this._strPad = function (value, length, chr, position) {
        value = value || '';
        let padLength = length - value.length;
        let pad = '';
        if (padLength > 0) {
            while (pad.length < padLength) {
                pad += chr;
            }
        }
        if (position === 'STR_PAD_RIGHT') {
            return value + pad;
        } else {
            return pad + value;
        }
    };

    this._sort = function (arrInput) {
        arrInput.sort(function (a, b) {
            return a - b
        });
        return arrInput;
    };

    this._keySort = function (obj) {
        let keys = Object.keys(obj).sort();
        let sortedObj = {};
        for (let i in keys) {
            sortedObj[keys[i]] = obj[keys[i]];
        }
        return sortedObj;
    };

    this._hexDec = function (hexString) {
        return parseInt(hexString, 16);
    };

    this._max = function (arrInput) {
        return Math.max.apply(null, arrInput);
    };


    this._asciiToHex = function (str) {
        if (str === "") {
            return "";
        } else {
            let hexCharCode = [];
            for (let i = 0; i < str.length; i++) {
                hexCharCode.push((str.charCodeAt(i)).toString(16));
            }
            return hexCharCode.join("");
        }
    };

    this._hexToAscii = function (str) {
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
    };

    this._baseConvert = function (number, fromBase, toBase) {
        // http://jsphp.co/jsphp/fn/view/base_convert
        // +   original by: Philippe Baumann
        // +   improved by: Rafał Kukawski (http://blog.kukawski.pl)
        // *     example 1: base_convert('A37334', 16, 2);
        // *     returns 1: '101000110111001100110100'
        return parseInt(number + '', fromBase | 0).toString(toBase | 0);
    };

    this._sprintf = function () {
        /*discuss at: https://locutus.io/php/sprintf/
        original by: Ash Searle (https://hexmen.com/blog/)
        improved by: Michael White (https://getsprink.com)
        improved by: Jack
        improved by: Kevin van Zonneveld (https://kvz.io)
        improved by: Kevin van Zonneveld (https://kvz.io)
        improved by: Kevin van Zonneveld (https://kvz.io)
        improved by: Dj
        improved by: Allidylls
        input by: Paulo Freitas
        input by: Brett Zamir (https://brett-zamir.me)
        improved by: Rafał Kukawski (https://kukawski.pl)
        example 1: sprintf("%01.2f", 123.1)
        returns 1: '123.10'
        example 2: sprintf("[%10s]", 'monkey')
        returns 2: '[    monkey]'
        example 3: sprintf("[%'#10s]", 'monkey')
        returns 3: '[####monkey]'
        example 4: sprintf("%d", 123456789012345)
        returns 4: '123456789012345'
        example 5: sprintf('%-03s', 'E')
        returns 5: 'E00'
        example 6: sprintf('%+010d', 9)
        returns 6: '+000000009'
        example 7: sprintf('%+0\'@10d', 9)
        returns 7: '@@@@@@@@+9'
        example 8: sprintf('%.f', 3.14)
        returns 8: '3.140000'
        example 9: sprintf('%% %2$d', 1, 2)
        returns 9: '% 2'*/
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
    };

    this.setValue = function (bit, value) {
        if ($this.fields.indexOf(bit) === -1) {
            $this.fields.push(bit);
        }

        $this.fields = $this._arrayUnique($this.fields);

        if (value !== null) {
            /*if ($this.generalConfig[bit][0] === 'n') {
                // numeric
                let val = value * 1;
                if ($this.generalConfig[bit][2] === 0) {
                    // fix length
                    value = $this._sprintf("%0" + $this.generalConfig[bit][1] + "d", val);//n是右靠，左补0
                }
                console.log("bit : " + bit + " value: " + value);
            } else {
                // non numeric
                if ($this.generalConfig[bit][2] === 0) {
                    // fix length
                    value = $this._strPad(value, $this.generalConfig[bit][1], ' ', 'STR_PAD_RIGHT'); //其他是左靠，右补空格
                }
                console.log("bit : " + bit + " value: " + value);
            }*/
            $this.values[bit] = value;
        } else {
            $this.values[bit] = null;
        }
        $this._sort($this.fields);
        $this._keySort($this.values);
    };

    this.getBitmap = function () {
        let tmp = $this._sprintf("%064d", 0).split('');
        let tmp2 = $this._sprintf("%064d", 0).split('');
        for (let key in $this.values) {
            if (key < 65) {
                tmp[key - 1] = 1;
            } else {
                tmp[0] = 1;
                tmp2[key - 65] = 1;
            }
        }
        let result = "";
        if (tmp[0] === 1) {
            while (tmp2.length > 0) {
                result += $this._baseConvert(tmp2.join('').substr(0, 4), 2, 16);
                tmp2 = tmp2.join('').substr(4, tmp2.length - 4).split('');
            }
        }
        let main = "";
        while (tmp.length > 0) {
            main += $this._baseConvert(tmp.join('').substr(0, 4), 2, 16);
            tmp = tmp.join('').substr(4, tmp.length - 4).split('');
        }
        $this._bitmap = (main + result).toUpperCase();

        return $this._bitmap;
    };

    this.parse = function (message) {

        let segment10Str = "";
        let segment11Str = "";
        let segment10Int = 0;
        let segment11Int = 0;

        let segment20Str = "";
        let segment21Str = "";
        let segment20Int = 0;
        let segment21Int = 0;

        let segment30Str = "";
        let segment31Str = "";
        let segment30Int = 0;
        let segment31Int = 0;

        $this.tpdu = message.substr(0, 10);
        console.log("unpack tpdu ==============================  ", $this.tpdu );

        $this.head = message.substr(10, 12);
        console.log("unpack head ==============================  ", $this.head );

        $this.msgType = message.substr(22, 4);
        console.log("unpack msgType ==============================  ", $this.msgType );

        segment10Str = message.substr(26, 8);
        console.log("unpack segment10Str ==============================  " ,segment10Str);

        segment11Str = message.substr(34, 8);

        console.log("unpack segment11Str ==============================  " ,segment11Str);

        segment10Int = $this._hexDec(segment10Str);
        segment11Int = $this._hexDec(segment11Str);

        $this.segment1[0] = segment10Int;
        $this.segment1[1] = segment11Int;

        if ($this._sprintf("%08x", ($this.segment1[0] & 0x80000000)) === "80000000") {

            segment20Str = message.substr(42, 8);
            segment21Str = message.substr(50, 8);
            segment20Int = $this._hexDec(segment20Str);
            segment21Int = $this._hexDec(segment21Str);
            $this.segment2[0] = segment20Int;
            $this.segment2[1] = segment21Int;
        }
        if ($this._sprintf("%08x", ($this.segment2[0] & 0x80000000)) === "80000000") {

            segment30Str = message.substr(58, 8);
            segment31Str = message.substr(66, 8);
            segment30Int = $this._hexDec(segment30Str);
            segment31Int = $this._hexDec(segment31Str);
            $this.segment3[0] = segment30Int;
            $this.segment3[1] = segment31Int;
        }
        let i = 0;

        let  k = $this.segment1[0];
        for (i = 1; i <= 32; i++) {
            if ($this._sprintf("%08x", (k & 0x80000000)) === "80000000" && i > 1) {

                $this.addFiled(i);
            }
            k = k - 0x80000000;
            k = k << 1;
        }
        k = $this.segment1[1];
        for (i = 33; i <= 64; i++) {
            if ($this._sprintf("%08x", (k & 0x80000000)) === "80000000") {
                $this.addFiled(i);
            }
            k = k - 0x80000000;
            k = k << 1;
        }
        let bitmapLength = 16;
        if ($this._sprintf("%08x", ($this.segment1[0] & 0x80000000)) === "80000000") {
            bitmapLength = 32;
            k = $this.segment2[0];
            for (i = 65; i <= 96; i++) {
                if ($this._sprintf("%08x", (k & 0x80000000)) === "80000000") {
                    $this.addFiled(i);
                }
                k = k - 0x80000000;
                k = k << 1;
            }
            k = $this.segment2[1];
            for (i = 97; i <= 128; i++) {
                if ($this._sprintf("%08x", (k & 0x80000000)) === "80000000") {
                    $this.addFiled(i);
                }
                k = k - 0x80000000;
                k = k << 1;
            }
            if ($this._sprintf("%08x", ($this.segment2[0] & 0x80000000)) === "80000000") {
                bitmapLength = 48;
                k = $this.segment3[0];
                for (i = 129; i <= 160; i++) {
                    if ($this._sprintf("%08x", (k & 0x80000000)) === "80000000") {
                        $this.addFiled(i);
                    }
                    k = k - 0x80000000;
                    k = k << 1;
                }
                k = $this.segment3[1];
                for (i = 161; i <= 192; i++) {
                    if ($this._sprintf("%08x", (k & 0x80000000)) === "80000000") {
                        $this.addFiled(i);
                    }
                    k = k - 0x80000000;
                    k = k << 1;
                }
            }
        }

        // parse body
        message = message.substr(bitmapLength + $this.tpdu.length+$this.head.length+$this.msgType.length);


        for (i in $this.fields) {
            let field_length;
            let data = "";
            let vals = "";

            let field = $this.fields[i];

            let element = $this.generalConfig[field];
            if (element[2] === 1) {
                // dynamic length
                let fl = element[1];

                let shift = fl>99?4:2;
                field_length = message.substr(0, shift) * 1;

                if (element[0] === 'a' || element[0] === 'an' || element[0] === 'ans' || element[0] === 'b') {
                    field_length *=2;
                }

                message = message.substr(shift);
                if (message.length >= field_length) {
                    data = message.substr(0, field_length);
                    field_length = (field_length % 2 === 0 ? field_length : field_length + 1);
                    message = message.substr(field_length);
                } else {
                    data = message;
                }
                if (element[0] === 'a' || element[0] === 'an' || element[0] === 'ans') {
                    vals = $this._hexToAscii(data).trim();
                    console.log("[Unpack]  message len = ", message.length );
                } else {
                    vals = data;
                }
            } else {
                // fix length
                field_length = element[1];
                if (element[0] === 'a' || element[0] === 'an' || element[0] === 'ans'|| element[0] === 'b') {
                    field_length = field_length * 2;
                }
                data = message.substr(0, field_length);
                if (element[0] === 'a' || element[0] === 'an' || element[0] === 'ans') {
                    vals = $this._hexToAscii(data).trim();
                } else {
                    vals = data;
                }

                field_length = (field_length % 2 === 0 ? field_length : field_length + 1);
                message = message.substr(field_length);
            }
            console.log("[Unpack] Field = " + field + ", data = " + vals);
            $this.addBit(field, vals);
        }
        return
    }

    this.getMaxField = function () {
        if ($this.fields.length) {
            return $this._max($this.fields);
        } else {
            return 0;
        }
    };

    this.getField = function () {
        let header = "";
        header += $this.msgType;
        let maxField = $this.getMaxField();
        let seg1 = $this._sprintf("%08x%08x", $this.segment1[0], $this.segment1[1]);
        header += seg1;
        if (maxField > 64) {
            let seg2 = $this._sprintf("%08x%08x", $this.segment2[0], $this.segment2[1]);
            header += seg2;
        }
        if (maxField > 128) {
            let seg3 = $this._sprintf("%08x%08x", $this.segment3[0], $this.segment3[1]);
            header += seg3;
        }
        return header;
    };

    this.listValue = function () {
        let arr = [];
        for (let i in $this.fields) {
            arr.push({
                'key': $this.fields[i],
                'value': $this.values[$this.fields[i]]
            });
        }
        return arr;
    };

    this.getBody = function () {
        let body = "";
        let value = "";
        let vals = "";
        let length = 0;
        $this.fields = $this._arrayUnique($this.fields);
        $this.fields = $this._sort($this.fields);
        for (let i in $this.fields) {
            let field = $this.fields[i];
            let type = $this.generalConfig[field][0];
            if ($this.generalConfig[field][2] === 1) {
                // dynamic
                value = $this.values[field] || '';
                length = value.length;
                let sl = this.generalConfig[field][1]>99?4:2;
                if (type === 'b') {
                    length=  length>>1;
                }
                let sf = $this._sprintf("%0" + sl + "d", length);
                body += sf;
                if (type === 'a' || type === 'an' || type === 'ans') {
                    console.log("[Pack] Field = " + field + ", Value = " + value);
                    vals = $this._asciiToHex(value);
                } else {
                    vals = value;
                    console.log("[Pack] Field = " + field + ", Value = " + value);
                }
                body += (vals.length % 2 === 0 ? vals : vals + '0');
            } else {
                // fix length
                value = $this.values[field];
                length = $this.generalConfig[field][1];
                if ($this.generalConfig[field][0] === 'n') {
                    let val = value * 1;
                    vals = $this._sprintf("%0" + length + "d", val); //n是右靠，左补0
                    console.log("[Pack] Field = " + field + ", Value = " + vals);
                } else {
                    if (type === 'a' || type === 'an' || type === 'ans') {
                        let val = $this._strPad(value, length, ' ', 'STR_PAD_RIGHT');//左靠，右补空格
                        console.log("[Pack] Field = " + field + ", Value = " + val);
                        vals = $this._asciiToHex(val);
                    } else {
                        vals = value;
                        console.log("[Pack] Field = " + field + ", Value = " + vals);

                    }
                }
                body += (vals.length % 2 === 0 ? vals : vals + '0');
            }
        }
        return body;
    };

    this.addBit = function (bit, value) {
        if(!value){
            return;
        }
        if ($this.fields.indexOf(bit) === -1) {
            $this.fields.push(bit);
        }
        if (typeof value != 'undefined') {
            $this.setValue(bit, value);
        }
    };
    this.addFiled = function (bit) {
        if ($this.fields.indexOf(bit) === -1) {
            $this.fields.push(bit);
        }
    };



    this.getBit = function (bit) {
        if (typeof bit == 'undefined') {
            return $this.values;
        } else {
            return $this.values[bit] || '';
        }
    };

    this.packISO = function () {
        let data =  $this.getTPDU() +$this.getHead()+$this.getMsgType() + $this.getBitmap() + $this.getBody();
        let len  =  $this.getIso8583Len(data.length>>1);

        console.log("[Pack] ISO8583 =======================> " ,len+data,);
        return GLOBAL_STRING_2_HEXARR(len+data);
    };

    this.unPackISO = function (iso) {
        return $this.parse(iso);
    };

    this.setMsgType = function (msgType) {
        $this.msgType = msgType;
    };

    this.getMsgType = function () {
        return $this.msgType;
    };

    this.setTPDU = function (tpdu) {
        $this.tpdu = tpdu;
    };
    this.getTPDU = function () {
        return $this.tpdu;
    };

    this.setHead = function (head) {
        $this.head = head;
    };

    this.getHead = function () {
        return $this.head;
    };

    this.getIso8583Len = function (len) {
        let arry = new Array();

        arry[0] =len>>8 ;
        arry[1] =len%256;
        let hexArr = Array.prototype.map.call(
           arry,
            function (bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
      return   hexArr.join('');

    };

    let $this = this;
}
function GLOBAL_PACK_8583(trans){
    console.log("  GLOBAL_PACK_8583  111111111111111111111" );


    if(!trans){
        return"";
    }
    console.log(" GLOBAL_PACK_8583   00000000000000000000" );

    let transParam =  Tos.GLOBAL_TRANSACTION.transParam ;
    let flow =  Tos.GLOBAL_TRANSACTION.flow ;
    let config =  Tos.GLOBAL_CONFIG ;

    console.log(" GLOBAL_PACK_8583   transParam" ,JSON.stringify(transParam) );
    console.log(" GLOBAL_PACK_8583   config" ,JSON.stringify(config) );
    console.log(" GLOBAL_PACK_8583   flow" ,JSON.stringify(flow) );

    let iso = new ISO8583();
    iso.setMsgType(transParam.msgType);
    console.log(" GLOBAL_PACK_8583   33333333333333333" );

    iso.setTPDU(config.tpdu);

    iso.setHead(config.head);

    console.log(" GLOBAL_PACK_8583   4444444444444" );

    iso.addBit(2,trans.pan);
    console.log(" GLOBAL_PACK_8583   55555555555555555555" );

    iso.addBit(3,transParam.procCode);
    iso.addBit(4,trans.amount);
    iso.addBit(11,trans.voucherNo);
    iso.addBit(12,trans.transTime.h + trans.transTime.m+ trans.transTime.s);
   // iso.addBit(13,trans.transTime.month+trans.transTime.date);
    iso.addBit(14,trans.expDate);
    console.log(" GLOBAL_PACK_8583   6666666" );

    iso.addBit(22,getInputMethod(trans.enterMode,flow.pin));
    iso.addBit(23,trans.cardSerialNo);
    iso.addBit(25,transParam.serviceCode);

    iso.addBit(26,flow.pin?"12":"");
    iso.addBit(35,trans.track2);
    iso.addBit(36,trans.track3);
    iso.addBit(37,trans.refNo);
    iso.addBit(38,trans.authCode);
    iso.addBit(41,config.termId);
    iso.addBit(42,config.merchantId);

    iso.addBit(49,config.countryCode);
    iso.addBit(52,flow.pin);
    iso.addBit(55,trans.sendIccData);
    iso.addBit(60,"22000001001");
    iso.addBit(61,"01");
    iso.addBit(64,"0000000000000000");

    console.log(" GLOBAL_PACK_8583   9999999" );

    return iso.packISO();
}


function GLOBAL_UNPACK_8583(unPackData,trans){
    console.log(" GLOBAL_UNPACK_8583   -00-0000000000" );

     let iso = new ISO8583();
     iso.unPackISO(unPackData);
    let temp= iso.getBit(39);
     if(temp){
         trans.response = temp;
     }else{
         return ;
     }
    temp= iso.getBit(4);
    if(temp){
        trans.amount = parseInt(temp);
    }

    temp= iso.getBit(12);
    if(temp){
        trans.transTime.h = temp.substring(0,2);
        trans.transTime.m = temp.substring(2,4);
        trans.transTime.s = temp.substring(4);
    }

    temp= iso.getBit(13);
    if(temp){
        trans.transTime.month = temp.substring(0,2);
        trans.transTime.date = temp.substring(2,4);
    }

    temp= iso.getBit(37);
    if(temp){
        trans.refNo = temp;
    }
    temp= iso.getBit(38);
    if(temp){
        trans.authCode = temp;
    }

    temp= iso.getBit(55);
    if(temp){
        trans.receiveIccData = temp;
    }

    temp= iso.getBit(62);
    if(temp){
       // trans.receiveIccData = temp;
    }

}



function  getInputMethod(entryMode,pin){
    let inputMethod = "";
    let CONSTANT = Tos.CONSTANT.ENTRY_MODE;
    switch (entryMode) {
        case  CONSTANT.MANUAL://manual
            inputMethod = "01";
            break;
        case CONSTANT.MAG: //mag
            inputMethod = "02";
            break;
        case CONSTANT.INSERT://insert
            inputMethod = "05";
            break;
        case CONSTANT.RF://rf
            inputMethod = "07";
            break;
        case CONSTANT.QR://qr
            inputMethod = "03";
            break;

        default:
            return "";
    }

    if (pin) {
        inputMethod += "1";
    } else {
        inputMethod += "2";
    }

    return inputMethod;
}

function TLV() {
    this.parse = function (data) {
        let tl = 2;
        let sl = 2;
        let remaining = data;
        let result = {};
        while (remaining.length > tl) {
            let tag = remaining.substr(0, tl);
            remaining = remaining.substr(2);
            let len = remaining.substr(0, sl);
            remaining = remaining.substr(2);
            let length = parseInt(len);
            let value = remaining.substr(0, length);
            remaining = remaining.substr(length);
            result[tag] = value;
        }
        return result;
    }
    this.build = function (data) {
        let result = '';
        for (let tag in data) {
            let len = data[tag].length;
            let length = (len < 10) ? ('0' + len) : len;
            result += tag + length + data[tag];
        }
        return result;
    }
}


// exports.GLOBAL_ISO8583 = new ISO8583();
// exports.GLOBAL_TLV = new TLV();
exports.GLOBAL_ISO8583 = ISO8583;
exports.GLOBAL_PACK_8583 = GLOBAL_PACK_8583;
exports.GLOBAL_UNPACK_8583 = GLOBAL_UNPACK_8583;


exports.GLOBAL_TLV = TLV;