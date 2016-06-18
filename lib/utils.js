'use strict';

const StripCombiningMarks = require('strip-combining-marks');
const Punycode = require('punycode');

const toArrayBuffer = (buffer) => {

  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};

const toBuffer = (ab) => {

  const buffer = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
};


const realLength = (str) => Punycode.ucs2.decode(StripCombiningMarks(str)).length;

module.exports = {
  realLength: realLength,
  toBuffer: toBuffer,
  toArrayBuffer: toArrayBuffer
};
