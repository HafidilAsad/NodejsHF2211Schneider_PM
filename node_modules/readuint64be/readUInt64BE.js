'use strict';
const Buffer = require('buffer').Buffer;

// readInt32BE(value, number[, offest])

function readUInt64BE(buf, offset) {
  if (offset){
    buf = buf.slice(offset, offset + 8);
  }
  // create a hex equivalent string:
  let str = buf.toString('hex');
  str = str.split('');
  let solution = 0;
  let mul = 15;
  str.forEach((num) => {
    let dec = getDecimal(num);
    solution += dec * Math.pow(16,mul);
    mul--;
  });
  return solution;        // (value position 0 * 16^15) + (value position 1 * 16^14) + ... +  (value position 7 * 16^0)
}

module.exports = readUInt64BE;

function getDecimal(hex) {
  switch (hex) {
    case '0':
      return 0;
      break;
    case '1':
      return 1;
      break;
    case '2':
      return 2;
      break;
    case '3':
      return 3;
      break;
    case '4':
      return 4;
      break;
    case '5':
      return 5;
      break;
    case '6':
      return 6;
      break;
    case '7':
      return 7;
      break;
    case '8':
      return 8;
      break;
    case '9':
      return 9;
      break;
    case 'a':
      return 10;
      break;
    case 'b':
      return 11;
      break;
    case 'c':
      return 12;
      break;
    case 'd':
      return 13;
      break;
    case 'e':
      return 14;
      break;
    case 'f':
      return 15;
      break;
    default :
      return 0;
  }
}
