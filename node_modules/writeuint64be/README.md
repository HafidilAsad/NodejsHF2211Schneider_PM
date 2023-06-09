# writeUInt64BE

### Safely create 64 bit buffers or add them to an existing buffer

Writes number to buf at the specified offset with specified big endian format. Number should be a valid signed 64-bit integer.

In computing. The number 9,223,372,036,854,775,807, equivalent to the hexadecimal value 7FFF,FFFF,FFFF,FFFF16, is the maximum value for a 64-bit signed integer in computing.

value is interpreted and written as a two's complement signed integer.

writeInt32BE(buf, number[, offest])
* `buf <Buffer> Original buffer to edit or change`
* `number <Integer> The signed integer to convert to a 64bit buffer`
* `offset <Integer> Where to start writing. Must satisfy: 0 <= offset <= buf.length - 8`

## Install

```
npm install writeuint64be
```

## Usage
```
const Buffer = require('buffer').Buffer;
const writeUInt64BE = require('writeUInt64BE');

// First example, writing to a buffer at a specified location:

let buf = new Buffer(16);
buf.fill(0);

buf.writeUInt32BE(0x417, 0);
buf.writeUInt32BE(0x27101980, 4);
writeUInt64BE(buf, 123456789, 8);

console.log(buf); // <Buffer 00 00 04 17 27 10 19 80 00 00 00 00 07 5b cd 15>

// Second example, concatenating to the original buffer:

let buf2 = new Buffer(8);
buf2.fill(0);

buf2.writeUInt32BE(0x417, 0);
buf2.writeUInt32BE(0x27101980, 4);
buf2 = writeUInt64BE(buf2, 123456789);

console.log(buf2); // <Buffer 00 00 04 17 27 10 19 80 00 00 00 00 07 5b cd 15>

```
