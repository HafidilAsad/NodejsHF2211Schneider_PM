const Buffer = require('buffer').Buffer;
const writeUInt64BE = require('writeUInt64BE');
const readUInt64BE = require('./readUInt64BE');

// First example, reading to a buffer at the beginning of the buffer:

let buf = new Buffer(8);

writeUInt64BE(buf, 123456789);
console.log(buf); // <Buffer 00 00 00 00 07 5b cd 15>

let decimal = readUInt64BE(buf);
console.log(decimal); // 123456789

// Second example, reading to a buffer at an offset

let buf2 = new Buffer(16);
buf2.fill(0);

writeUInt64BE(buf2, 123456789, 8);
console.log(buf2); // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 07 5b cd 15>

let decimal2 = readUInt64BE(buf2, 8);
console.log(decimal2); // 123456789
