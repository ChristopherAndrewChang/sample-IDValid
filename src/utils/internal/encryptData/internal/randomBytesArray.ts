export default function randomBytesArray(length) {
  const result = new Uint8Array(length)
  for (let i = 0 ; i < length ; i++) {
      result[i] = Math.round(Math.random() * 0xFF)
  }
  return result
}