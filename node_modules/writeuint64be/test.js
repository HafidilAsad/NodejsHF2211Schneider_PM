const Buffer = require('buffer').Buffer;
const writeUInt64BE = require('./writeUInt64BE');

// First example, writing to a buffer at a specified location:

let buf = new Buffer(16);
buf.fill(0);

buf.writeUInt32BE(0x417, 0);
buf.writeUInt32BE(0x27101980, 4);
writeUInt64BE(buf, 123456789, 8);

console.log(buf); // <Buffer 00 00 04 17 27 10 19 80 00 00 00 00 07 5b cd 15>

// Second example, without an offset:

let buf2 = new Buffer(8);

writeUInt64BE(buf2, 123456789);

console.log(buf2); // <Buffer 00 00 00 00 07 5b cd 15>
