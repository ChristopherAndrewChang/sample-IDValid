export default function packUInt64BigEndian(value) {
  const result = new Uint8Array(8)
  const view = new DataView(result.buffer);
  view.setBigUint64(0, BigInt(value), false);
  return result
}