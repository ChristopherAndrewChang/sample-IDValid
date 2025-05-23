export default function packUInt32(value, littleEndian=true) {
  console.log('packUInt32', {value, littleEndian})
  const result = new Uint8Array(4)
  console.log('packUInt32 result', result)
  const view = new DataView(result.buffer);
  console.log('packUInt32 view', view)
  view.setUint32(0, value, littleEndian);
  console.log('packUInt32 set', result)
  return result;
}