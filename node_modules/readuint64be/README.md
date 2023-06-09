# readUInt64BE

### Safely read 64 Big Endian hex buffers

Reads hex buffer at the specified offset with specified big endian format. Number should be a valid signed 64-bit integer.

In computing. The number 9,223,372,036,854,775,807, equivalent to the hexadecimal value 7FFF,FFFF,FFFF,FFFF16, is the maximum value for a 64-bit signed integer in computing.

value is interpreted and written as a signed integer.

readInt32BE(buf, [, offest])
* `buf <Buffer> Original buffer to edit or change`
* `offset <Integer> Where to start writing. Must satisfy: 0 <= offset <= buf.length - 8`

## Install

```
npm install readuint64be
```

## Usage
```
const Buffer = require('buffer').Buffer;
const writeUInt64BE = require('writeUInt64BE');
const readUInt64BE = require('./readUInt64BE');

// First example, read a buffer at the beginning of the buffer:

let buf = new Buffer(8);

writeUInt64BE(buf, 123456789);
console.log(buf); // <Buffer 00 00 00 00 07 5b cd 15>

let decimal = readUInt64BE(buf);
console.log(decimal); // 123456789

// Second example, read a buffer at an offset

let buf2 = new Buffer(16);
buf2.fill(0);

writeUInt64BE(buf2, 123456789, 8);
console.log(buf2); // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 07 5b cd 15>

let decimal2 = readUInt64BE(buf2, 8);
console.log(decimal2); // 123456789


```
