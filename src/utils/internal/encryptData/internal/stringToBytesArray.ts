export default function stringToBytesArray(input) {
  return new Uint8Array(input.split('').map(i => i.charCodeAt(0)))
}