// RSA����
var biRadixBits = 16;
var bitsPerDigit = biRadixBits;
var biRadix = 1 << 16;
var biHalfRadix = biRadix >>> 1;
var biRadixSquared = biRadix * biRadix;
var maxDigitVal = biRadix - 1;
var maxDigits;
var ZERO_ARRAY;
var bigOne;
var highBitMasks = [
  0x0000,
  0x8000,
  0xC000,
  0xE000,
  0xF000,
  0xF800,
  0xFC00,
  0xFE00,
  0xFF00,
  0xFF80,
  0xFFC0,
  0xFFE0,
  0xFFF0,
  0xFFF8,
  0xFFFC,
  0xFFFE,
  0xFFFF
];
var lowBitMasks = [
  0x0000,
  0x0001,
  0x0003,
  0x0007,
  0x000F,
  0x001F,
  0x003F,
  0x007F,
  0x00FF,
  0x01FF,
  0x03FF,
  0x07FF,
  0x0FFF,
  0x1FFF,
  0x3FFF,
  0x7FFF,
  0xFFFF
];
var hexToChar = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f'
];
var bigZero;
function setMaxDigits (value) {
  maxDigits = value;
  ZERO_ARRAY = new Array(maxDigits);
  for (var iza = 0; iza < ZERO_ARRAY.length; iza++) {
    ZERO_ARRAY[iza] = 0;
  }
  bigZero = new BigInt();
  bigOne = new BigInt();
  bigOne.digits[0] = 1;
};
function BigInt (flag) {
  if (typeof flag === 'boolean' && flag == true) {
    this.digits = null;
  } else {
    this.digits = ZERO_ARRAY.slice(0);
  }
  ;
  this.isNeg = false;
};
function charToHex (c) {
  var ZERO = 48;
  var NINE = ZERO + 9;
  var littleA = 97;
  var littleZ = littleA + 25;
  var bigA = 65;
  var bigZ = 65 + 25;
  var result;
  if (c >= ZERO && c <= NINE) {
    result = c - ZERO;
  } else if (c >= bigA && c <= bigZ) {
    result = 10 + c - bigA;
  } else if (c >= littleA && c <= littleZ) {
    result = 10 + c - littleA;
  } else {
    result = 0;
  }
  ;
  return result;
};
function hexToDigit (s) {
  var result = 0;
  var sl = Math.min(s.length, 4);
  for (var i = 0; i < sl; ++i) {
    result <<= 4;
    result |= charToHex(s.charCodeAt(i));
  };
  return result;
};
function biFromHex (s) {
  var result = new BigInt();
  var sl = s.length;
  for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
    result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
  };
  return result;
};
function RSAKeyPairApp (encryptionExponent, decryptionExponent, modulus) {
  this.e = biFromHex(encryptionExponent);
  this.d = biFromHex(decryptionExponent);
  this.m = biFromHex(modulus);
  this.chunkSize = 128;
  this.radix = 16;
  this.barrett = new BarrettMu(this.m);
};
function BarrettMu (m) {
  this.modulus = biCopy(m);
  this.k = biHighIndex(this.modulus) + 1;
  var b2k = new BigInt();
  b2k.digits[2 * this.k] = 1;
  this.mu = biDivide(b2k, this.modulus);
  this.bkplus1 = new BigInt();
  this.bkplus1.digits[this.k + 1] = 1;
  this.modulo = BarrettMuModulo;
  this.multiplyMod = BarrettMuMultiplyMod;
  this.powMod = BarrettMupowMod;
};
function biCopy (bi) {
  var result = new BigInt(true);
  result.digits = bi.digits.slice(0);
  result.isNeg = bi.isNeg;
  return result;
};
function biHighIndex (x) {
  var result = x.digits.length - 1;
  while (result > 0 && x.digits[result] == 0) {
    --result;
  };
  return result;
};
function biDivideModulo (x, y) {
  var nb = biNumBits(x);
  var tb = biNumBits(y);
  var origYIsNeg = y.isNeg;
  var q;
  var r;
  if (nb < tb) {
    if (x.isNeg) {
      q = biCopy(bigOne);
      q.isNeg = !y.isNeg;
      x.isNeg = false;
      y.isNeg = false;
      r = biSubtract(y, x);
      x.isNeg = true;
      y.isNeg = origYIsNeg;
    } else {
      q = new BigInt();
      r = biCopy(x);
    }
    return [
      q, r
    ];
  }
  ;
  q = new BigInt();
  r = x;
  var t = Math.ceil(tb / bitsPerDigit) - 1;
  var lambda = 0;
  while (y.digits[t] < biHalfRadix) {
    y = biShiftLeft(y, 1);
    ++lambda;
    ++tb;
    t = Math.ceil(tb / bitsPerDigit) - 1;
  }
  ;
  r = biShiftLeft(r, lambda);
  nb += lambda;
  var n = Math.ceil(nb / bitsPerDigit) - 1;
  var b = biMultiplyByRadixPower(y, n - t);
  while (biCompare(r, b) != -1) {
    ++q.digits[n - t];
    r = biSubtract(r, b);
  }
  ;
  for (var i = n; i > t; --i) {
    var ri = (i >= r.digits.length) ? 0 : r.digits[i];
    var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
    var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
    var yt = (t >= y.digits.length) ? 0 : y.digits[t];
    var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
    if (ri == yt) {
      q.digits[i - t - 1] = maxDigitVal;
    } else {
      q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
    }
    var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
    var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
    while (c1 > c2) {
      --q.digits[i - t - 1];
      c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
      c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2);
    }
    b = biMultiplyByRadixPower(y, i - t - 1);
    r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
    if (r.isNeg) {
      r = biAdd(r, b);
      --q.digits[i - t - 1];
    }
  }
  ;
  r = biShiftRight(r, lambda);
  q.isNeg = x.isNeg != origYIsNeg;
  if (x.isNeg) {
    if (origYIsNeg) {
      q = biAdd(q, bigOne);
    } else {
      q = biSubtract(q, bigOne);
    }
    y = biShiftRight(y, lambda);
    r = biSubtract(y, r);
  }
  if (r.digits[0] == 0 && biHighIndex(r) == 0) {
    r.isNeg = false;
  }
  return [
    q,
    r
  ];
};
function biDivide (x, y) {
  return biDivideModulo(x, y)[0];
};
function biNumBits (x) {
  var n = biHighIndex(x);
  var d = x.digits[n];
  var m = (n + 1) * bitsPerDigit;
  var result;
  for (result = m; result > m - bitsPerDigit; --result) {
    if ((d & 0x8000) != 0) {
      break;
    }
    d <<= 1;
  }
  ;
  return result;
};
function biShiftLeft (x, n) {
  var digitCount = Math.floor(n / bitsPerDigit);
  var result = new BigInt();
  arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
  var bits = n % bitsPerDigit;
  var rightBits = bitsPerDigit - bits;
  for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
    result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) | ((result.digits[i1] & highBitMasks[bits]) >>> (rightBits));
  }
  ;
  result.digits[0] = ((result.digits[i] << bits) & maxDigitVal);
  result.isNeg = x.isNeg;
  return result;
};
function arrayCopy (src, srcStart, dest, destStart, n) {
  var m = Math.min(srcStart + n, src.length);
  for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
    dest[j] = src[i];
  }
};
function biMultiplyByRadixPower (x, n) {
  var result = new BigInt();
  arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
  return result;
};
function biCompare (x, y) {
  if (x.isNeg != y.isNeg) {
    return 1 - 2 * Number(x.isNeg);
  }
  ;
  for (var i = x.digits.length - 1; i >= 0; --i) {
    if (x.digits[i] != y.digits[i]) {
      if (x.isNeg) {
        return 1 - 2 * Number(x.digits[i] > y.digits[i]);
      } else {
        return 1 - 2 * Number(x.digits[i] < y.digits[i]);
      }
    }
  }
  ;
  return 0;
};
function biSubtract (x, y) {
  var result;
  if (x.isNeg != y.isNeg) {
    y.isNeg = !y.isNeg;
    result = biAdd(x, y);
    y.isNeg = !y.isNeg;
  } else {
    result = new BigInt();
    var n;
    var c;
    c = 0;
    for (var i = 0; i < x.digits.length; ++i) {
      n = x.digits[i] - y.digits[i] + c;
      result.digits[i] = n % biRadix;
      if (result.digits[i] < 0) {
        result.digits[i] += biRadix;
      }
      c = 0 - Number(n < 0);
    }
    if (c == -1) {
      c = 0;
      for (var j = 0; j < x.digits.length; ++j) {
        n = 0 - result.digits[j] + c;
        result.digits[j] = n % biRadix;
        if (result.digits[j] < 0) {
          result.digits[j] += biRadix;
        }
        c = 0 - Number(n < 0);
      }
      result.isNeg = !x.isNeg;
    } else {
      result.isNeg = x.isNeg;
    }
  }
  ;
  return result;
};
function biMultiplyDigit (x, y) {
  var n;
  var c;
  var uv;
  var result = new BigInt();
  n = biHighIndex(x);
  c = 0;
  for (var j = 0; j <= n; ++j) {
    uv = result.digits[j] + x.digits[j] * y + c;
    result.digits[j] = uv & maxDigitVal;
    c = uv >>> biRadixBits;
  }
  result.digits[1 + n] = c;
  return result;
};
function biShiftRight (x, n) {
  var digitCount = Math.floor(n / bitsPerDigit);
  var result = new BigInt();
  arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
  var bits = n % bitsPerDigit;
  var leftBits = bitsPerDigit - bits;
  for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
    result.digits[i] = (result.digits[i] >>> bits) | ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
  }
  ;
  result.digits[result.digits.length - 1] >>>= bits;
  result.isNeg = x.isNeg;
  return result;
};
function BarrettMuModulo (x) {
  var q1 = biDivideByRadixPower(x, this.k - 1);
  var q2 = biMultiply(q1, this.mu);
  var q3 = biDivideByRadixPower(q2, this.k + 1);
  var r1 = biModuloByRadixPower(x, this.k + 1);
  var r2term = biMultiply(q3, this.modulus);
  var r2 = biModuloByRadixPower(r2term, this.k + 1);
  var r = biSubtract(r1, r2);
  if (r.isNeg) {
    r = biAdd(r, this.bkplus1);
  }
  ;
  var rgtem = biCompare(r, this.modulus) >= 0;
  while (rgtem) {
    r = biSubtract(r, this.modulus);
    rgtem = biCompare(r, this.modulus) >= 0;
  }
  ;
  return r;
};
function BarrettMuMultiplyMod (x, y) {
  var xy = biMultiply(x, y);
  return this.modulo(xy);
};
function BarrettMupowMod (x, y) {
  var result = new BigInt();
  result.digits[0] = 1;
  var a = x;
  var k = y;
  while (true) {
    if ((k.digits[0] & 1) != 0) {
      result = this.multiplyMod(result, a);
    }
    k = biShiftRight(k, 1);
    if (k.digits[0] == 0 && biHighIndex(k) == 0) {
      break;
    }
    a = this.multiplyMod(a, a);
  }
  ;
  return result;
};
function encryptedString (key, s) {
  var a = [];
  var sl = s.length;
  var i = 0;
  while (i < sl) {
    a[i] = s.charCodeAt(i);
    i++;
  }
  ;
  while (a.length % key.chunkSize != 0) {
    a[i++] = 0;
  }
  ;
  var al = a.length;
  var result = '';
  var j;
  var k;
  var block;
  for (i = 0; i < al; i += key.chunkSize) {
    block = new BigInt();
    j = 0;
    for (k = i; k < i + key.chunkSize; ++j) {
      block.digits[j] = a[k++];
      block.digits[j] += a[k++] << 8;
    }
    var crypt = key.barrett.powMod(block, key.e);
    var text = key.radix == 16 ? biToHex(crypt) : biToString(crypt, key.radix);
    result += text + ' ';
  }
  ;
  return result.substring(0, result.length - 1);
};
function biMultiply (x, y) {
  var result = new BigInt();
  var c;
  var n = biHighIndex(x);
  var t = biHighIndex(y);
  var uv;
  var k;
  for (var i = 0; i <= t; ++i) {
    c = 0;
    k = i;
    for (let j = 0; j <= n; ++j, ++k) {
      uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
      result.digits[k] = uv & maxDigitVal;
      c = uv >>> biRadixBits;
    }
    result.digits[i + n + 1] = c;
  }
  ;
  result.isNeg = x.isNeg != y.isNeg;
  return result;
};
function biDivideByRadixPower (x, n) {
  var result = new BigInt();
  arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
  return result;
};
function biModuloByRadixPower (x, n) {
  var result = new BigInt();
  arrayCopy(x.digits, 0, result.digits, 0, n);
  return result;
};
function biToHex (x) {
  var result = '';
  for (var i = biHighIndex(x); i > -1; --i) {
    result += digitToHex(x.digits[i]);
  };
  return result;
};
function digitToHex (n) {
  var mask = 0xf;
  var result = '';
  for (let i = 0; i < 4; ++i) {
    result += hexToChar[n & mask];
    n >>>= 4;
  }
  ;
  return reverseStr(result);
};
function reverseStr (s) {
  var result = '';
  for (var i = s.length - 1; i > -1; --i) {
    result += s.charAt(i);
  }
  ;
  return result;
};
function biAdd (x, y) {
  var result;
  if (x.isNeg != y.isNeg) {
    y.isNeg = !y.isNeg;
    result = biSubtract(x, y);
    y.isNeg = !y.isNeg;
  } else {
    result = new BigInt();
    var c = 0;
    var n;
    for (var i = 0; i < x.digits.length; ++i) {
      n = x.digits[i] + y.digits[i] + c;
      result.digits[i] = n % biRadix;
      c = Number(n >= biRadix);
    }
    result.isNeg = x.isNeg;
  }
  ;
  return result;
};
var hexatrigesimalToChar = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];
function biToString (x, radix) {
  var b = new BigInt();
  b.digits[0] = radix;
  var qr = biDivideModulo(x, b);
  var result = hexatrigesimalToChar[qr[1].digits[0]];
  while (biCompare(qr[0], bigZero) == 1) {
    qr = biDivideModulo(qr[0], b);
    result += hexatrigesimalToChar[qr[1].digits[0]];
  }
  ;
  return (x.isNeg ? '-' : '') + reverseStr(result);
};
export default function encrypts (str) {
  var exponent = '10001';
  var data = str.split('').reverse().join('');
  var publicKey = 'd741760e63aab01eecf8f2237468da2c9a1f3dfb7de74d8bed23de8eb734b0771aa88ab3acfe3d223f24c057a37f8976cd592a5061fba10cfa212ac7448ef4ce9710a3c5ecb176ed10f55612de976edda1a000faf74923efa80645d0654588c1bc314a28879aeda2ed08b0b83c3582ef3de1fe9125aa67130cdfcd3128732461';

  setMaxDigits(130);

  var key = new RSAKeyPairApp(exponent, '', publicKey);
  var inputLen = data.length;
  var encryptedData = '';
  var offSet = 0;
  var cache = '';
  var i = 0;
  var MAX_ENCRYPT_BLOCK = 128;

  // �����ݷֶμ���
  while (inputLen - offSet > 0) {
    if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
      cache = encryptedString(key, data.substr(offSet, MAX_ENCRYPT_BLOCK));
    } else {
      cache = encryptedString(key, data.substr(offSet, inputLen - offSet));
    }
    encryptedData = cache + encryptedData;
    i++;
    offSet = i * MAX_ENCRYPT_BLOCK;
  }

  return encryptedData;
}
