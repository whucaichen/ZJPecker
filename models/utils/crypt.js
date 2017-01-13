/**
 * Created by Chance on 16/11/18.
 */
module.exports = function(){
    this.Mac_919 = function(key, vector, data){
        return Mac_919(key, vector, data);
    };
    this.getUuid = function (len, radix){
        return getUuid(len, radix);
    };
    this.int2byte = function(n){
        return int2byte(n);
    };
    this.getHexStr = function(bs){
        return getHexStr(bs);
    };
    return this;
}();

var s1 = [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
];
var s2 = [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
];
var s3 = [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
];
var s4 = [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
];
var s5 = [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
];
var s6 = [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
];
var s7 = [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
];
var s8 = [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
];
var ip = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];
var _ip = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];
var LS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
var subKey = [];

var getUuid = function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
    return null;
};

var Mac_919 = function (key, vector, data) {
    //if (typeof key != "string" || typeof vector != "string" || typeof data != "string") {
    //    console.log("params of ansix9.19 must be string");
    //    return null;
    //}
    if (key.length !== 32) {
        console.log("key of ansix9.19 must be 32");
        return null;
    }
    var left = key.substring(0, 16);
    var right = key.substring(16);
    var mac = MAC(left, null, data);
    var result1 = DES_1(mac, right, 1);
    var result2 = DES_1(result1, left, 0);

    //var ret = result2.substring(0, 8);
    var ret = result2;
    return ret;
};
var MAC = function (key, vector, data) {
    if (key.length !== 16) {
        console.log("key of ansix9.9 must be 16");
        return null;
    }
    if (vector == null || vector.length !== 16) {
        vector = "0000000000000000";
    }
    var sb = data;
    var mod = data.length % 16;
    if (mod !== 0) {
        for (var i = 0; i < 16 - mod; i++) {
            //sb.append("0");
            sb += "0";
        }
    }
    var count = sb.length / 16;
    var blocks = [];
    for (var i = 0; i < count; i++) {
        blocks[i] = sb.substring(i * 16, i * 16 + 16);
    }
    for (var i = 0; i < count; i++) {
        var xor = xOrString(vector, blocks[i]);
        vector = DES_1(xor, key, 0);
    }
    return vector;
};
var DES_1 = function (source, key, type) {
    if (source.length !== 16 || key.length !== 16)
        return null;
    if (type == 0) {
        return encryption(source, key);
    }
    if (type == 1) {
        return discryption(source, key);
    }
    return null;
};
var encryption = function (D, K) {
    var str = "";
    var temp = [];
    var data = string2Binary(D);
    data = changeIP(data);
    var left = [];
    var right = [];
    for (var i = 0; i < 17; i++) {
        left[i] = [];
        right[i] = [];
    }
    for (var j = 0; j < 32; j++) {
        left[0][j] = data[j];
        right[0][j] = data[j + 32];
    }
    setKey(K);
    for (var i = 1; i < 17; i++) {
        var key = subKey[i - 1];
        left[i] = right[i - 1];
        var fTemp = f(right[i - 1], key);
        right[i] = diffOr(left[i - 1], fTemp);
    }
    for (var i = 0; i < 32; i++) {
        temp[i] = right[16][i];
        temp[32 + i] = left[16][i];
    }
    temp = changeInverseIP(temp);
    str = binary2ASC(intArr2Str(temp));
    return str;
};

var discryption = function (source, key) {
    var str = "";
    var data = string2Binary(source);
    data = changeIP(data);
    var left = [];
    var right = [];
    var tmp = [];
    for (var j = 0; j < 32; j++) {
        left[j] = data[j];
        right[j] = data[j + 32];
    }
    setKey(key);
    for (var i = 16; i > 0; i--) {
        var sKey = subKey[i - 1];
        tmp = left;
        left = right;
        var fTemp = f(right, sKey);
        right = diffOr(tmp, fTemp);
    }
    for (var i = 0; i < 32; i++) {
        data[i] = right[i];
        data[32 + i] = left[i];
    }
    data = changeInverseIP(data);
    for (var i = 0; i < data.length; i++) {
        str += data[i];
    }
    str = binary2ASC(str);
    return str;
};
var string2Binary = function (source) {
    var len = source.length;
    //var dest = [];
    var dest = new Array(len * 4);
    for (var i = 0; i < dest.length; i++) {
        dest[i] = 0;
    }
    //var arr = source.toCharArray();//////////
    var arr = source.split("");
    for (var i = 0; i < len; i++) {
        var t = 0;
        t = getIntByChar(arr[i]);
        //var str = Integer.toBinaryString(t).split("");//////////
        var str = t.toString(2).split("");//////////
        var k = i * 4 + 3;
        for (var j = str.length - 1; j > 0; j--) {
            dest[k] = parseInt(str[j]);//////////
            k--;
        }
    }
    return dest;
};
var changeIP = function (source) {
    var dest = [];
    for (var i = 0; i < 64; i++) {
        dest[i] = source[ip[i] - 1];
    }
    return dest;
};
var setKey = function (source) {
    if (subKey.length > 0)
        subKey = [];
    var temp = string2Binary(source);
    var left = [];
    var right = [];
    var temp1 = [];
    temp1 = keyPC_1(temp);
    for (var i = 0; i < 28; i++) {
        left[i] = temp1[i];
        right[i] = temp1[i + 28];
    }
    for (var i = 0; i < 16; i++) {
        left = keyLeftMove(left, LS[i]);
        right = keyLeftMove(right, LS[i]);
        for (var j = 0; j < 28; j++) {
            temp1[j] = left[j];
            temp1[j + 28] = right[j];
        }
        subKey[i] = keyPC_2(temp1);
    }
};
var f = function (R, K) {
    var dest = [];
    var temp = [];
    var expendR = expend(R);
    temp = diffOr(expendR, K);
    dest = press(temp);
    return dest;
};
var diffOr = function (source1, source2) {
    var len = source1.length;
    var dest = [];
    for (var i = 0; i < len; i++) {
        dest[i] = source1[i] ^ source2[i];
    }
    return dest;
};
var changeInverseIP = function (source) {
    var dest = [];
    for (var i = 0; i < 64; i++) {
        dest[i] = source[_ip[i] - 1];
    }
    return dest;
};
var binary2ASC = function (s) {
    var str = "";
    var ii = 0;
    var len = s.length;
    if (len % 4 !== 0) {
        while (ii < 4 - len % 4) {
            s = "0" + s;
        }
    }
    for (var i = 0; i < len / 4; i++) {
        str += binary2Hex(s.substring(i * 4, i * 4 + 4));
    }
    return str;
};
var binary2Hex = function (s) {
    var len = s.length;
    var result = 0;
    var k = 0;
    if (len > 4)
        return null;
    for (var i = len; i > 0; i--) {
        result += parseInt(s.substring(i - 1, i)) * getXY(2, k);//////////
        k++;
    }
    switch (result) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return "" + result;
        case 10:
            return "A";
        case 11:
            return "B";
        case 12:
            return "C";
        case 13:
            return "D";
        case 14:
            return "E";
        case 15:
            return "F";
        default:
            return null;
    }
};
var intArr2Str = function (arr) {
    var sb = "";
    for (var i = 0; i < arr.length; i++) {
        //sb.append(arr[i]);
        sb += arr[i];
    }
    return sb.toString();
};
var xOrString = function (pan, pin) {
    if (pan.length !== pin.length) {
        new Exception("异或因子长度不一致").printStackTrace();
        return null;
    }
    var bytepan = getHexByte(pan);
    var bytepin = getHexByte(pin);
    //var result = [];
    //for (var i = 0; i < result.length; i++) {
    //    result[i] = (bytepan[i] ^ bytepin[i]);
    //}
    //return getHexStr(result);
    //var bytepan = new Buffer(pan);
    //var bytepin = new Buffer(pin);
    var result = new Buffer(bytepan.length);
    for (var i = 0; i < result.length; i++) {
        result[i] = (bytepan[i] ^ bytepin[i]);
    }
    return getHexStr(result).toUpperCase();
    //return result.toString();
};
var keyPC_1 = function (source) {
    var dest = [];
    var temp = [
        57, 49, 41, 33, 25, 17, 9,
        1, 58, 50, 42, 34, 26, 18,
        10, 2, 59, 51, 43, 35, 27,
        19, 11, 3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15,
        7, 62, 54, 46, 38, 30, 22,
        14, 6, 61, 53, 45, 37, 29,
        21, 13, 5, 28, 20, 12, 4
    ];
    for (var i = 0; i < 56; i++) {
        dest[i] = source[temp[i] - 1];
    }
    return dest;
};
var keyPC_2 = function (source) {
    var dest = [];
    var temp = [
        14, 17, 11, 24, 1, 5,
        3, 28, 15, 6, 21, 10,
        23, 19, 12, 4, 26, 8,
        16, 7, 27, 20, 13, 2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    ];
    for (var i = 0; i < 48; i++) {
        dest[i] = source[temp[i] - 1];
    }
    return dest;
};
var keyLeftMove = function (source, i) {
    var temp = 0;
    var len = source.length;
    var ls = LS[i];
    for (var k = 0; k < ls; k++) {
        temp = source[0];
        for (var j = 0; j < len - 1; j++) {
            source[j] = source[j + 1];
        }
        source[len - 1] = temp;
    }
    return source;
};
var expend = function (source) {
    var ret = [];
    var temp = [
        32, 1, 2, 3, 4, 5,
        4, 5, 6, 7, 8, 9,
        8, 9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32, 1
    ];
    for (var i = 0; i < 48; i++) {
        ret[i] = source[temp[i] - 1];
    }
    return ret;
};
var press = function (source) {
    var ret = [];
    var temp = [];
    for (var i = 0; i < 8; i++) {
        temp[i] = [];
    }
    var s = [s1, s2, s3, s4, s5, s6, s7, s8];
    var str = "";
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 6; j++) {
            temp[i][j] = source[i * 6 + j];
        }
    }
    for (var i = 0; i < 8; i++) {
        var x = temp[i][0] * 2 + temp[i][5];
        var y = temp[i][1] * 8 + temp[i][2] * 4 + temp[i][3] * 2 + temp[i][4];
        var val = s[i][x][y];
        var ch = int2Hex(val);
        //str.append(ch);
        str += ch;
    }
    ret = string2Binary(str.toString());
    ret = dataP(ret);
    return ret;
};
var getIntByChar = function (ch) {
    var t = ch.toUpperCase();
    var i = 0;
    switch (t) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            i = parseInt(t);//////////
            break;
        case 'A':
            i = 10;
            break;
        case 'B':
            i = 11;
            break;
        case 'C':
            i = 12;
            break;
        case 'D':
            i = 13;
            break;
        case 'E':
            i = 14;
            break;
        case 'F':
            i = 15;
            break;
        default:
            console.log("getIntByChar was wrong");
    }
    return i;
};
var int2Hex = function (i) {
    switch (i) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return "" + i;
        case 10:
            return "A";
        case 11:
            return "B";
        case 12:
            return "C";
        case 13:
            return "D";
        case 14:
            return "E";
        case 15:
            return "F";
        default:
            return null;
    }
};
var dataP = function (source) {
    var dest = [];
    var temp = [
        16, 7, 20, 21,
        29, 12, 28, 17,
        1, 15, 23, 26,
        5, 18, 31, 10,
        2, 8, 24, 14,
        32, 27, 3, 9,
        19, 13, 30, 6,
        22, 11, 4, 25
    ];
    var len = source.length;
    for (var i = 0; i < len; i++) {
        dest[i] = source[temp[i] - 1];
    }
    return dest;
};
var getHexByte = function (byteStr) {
    //if (byteStr.length % 2 != 0) {
    //    byteStr = "0" + byteStr;
    //}
    //var retByte = new Buffer(byteStr.length / 2);
    //for (var i = 0; i < byteStr.length / 2; i++) {
    //    var b = new Buffer(1);
    //    b[0] = int2byte(parseInt(byteStr.substring(2 * i, 2 * i + 2), 16))[3];//////////
    //    retByte[i] = int2byte(parseInt(byteStr.substring(2 * i, 2 * i + 2), 16))[3];
    //}
    //return retByte;
    return Str2Bytes(byteStr);
};
var getHexStr = function (bs) {
    //var sb = "";
    //if (bs != null) {
    //    for (var i = 0; i < bs.length; i++) {
    //        //sb.append(getHexStr1(bs[i]));
    //        sb += getHexStr1(bs[i]);
    //    }
    //}
    //return sb.toString().toUpperCase();
    return Bytes2Str(bs);
};
var getHexStr1 = function (bs) {
    var retStr = "";
    //if (Integer.toHexString(bs).length > 1) {
    if (bs.toString(16).length > 1) {
        //retStr += Integer.toHexString(bs).substring(Integer.toHexString(bs).length - 2);
        retStr += bs.toString(16).substring(bs.toString(16).length - 2);
    } else {
        retStr += "0"
                //+ Integer.toHexString(bs).substring(Integer.toHexString(bs).length - 1);
            + bs.toString(16).substring(bs.toString(16).length - 1);
    }
    return retStr;
};
var int2byte = function (n) {
    //var b = [];
    //b[0] = (n >> 24);
    //b[1] = (n >> 16);
    //b[2] = (n >> 8);
    //b[3] = n;
    //return b;
    var b = new Buffer(4);
    b[0] = (n >> 24);
    b[1] = (n >> 16);
    b[2] = (n >> 8);
    b[3] = n;
    return b;
};
var toHexString = function (str) {
    var val = "";
    var arr = str.split(",");
    for (var i = 0; i < arr.length; i++) {
        val += arr[i].fromCharCode(i);
    }
    return val;
};
var getXY = function (x, y) {
    var temp = x;
    if (y == 0) x = 1;
    for (var i = 2; i <= y; i++) {
        x *= temp;
    }
    return x;
};
var stringToBytes = function (str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);  // get char
        st = [];                 // set up "stack"
        do {
            st.push(ch & 0xFF);  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
        }
        while (ch);
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat(st.reverse());
    }
    // return an array of bytes
    return re;
};
//十六进制字符串转字节数组
function Str2Bytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 !== 0) {
        return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}
//字节数组转十六进制字符串
function Bytes2Str(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        var tmp = arr[i].toString(16);
        if (tmp.length == 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}

//var uuid = getUuid(32, 16);
//var uuid = "7BE9BEEA870E6F226979D4872556EFE9";
//var uuid = "051e38e058f3498a873791e7d6cd9e00";
//console.log(uuid);
//var testMac = crypt(uuid, null, "ABCDEF");
//console.log(testMac);

//var s2b = string2Binary("abcdef");
//console.log(s2b.length);
//console.log(s2b.toString());