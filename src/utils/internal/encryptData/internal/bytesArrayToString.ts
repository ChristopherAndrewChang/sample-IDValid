export default function bytesArrayToString(input) {
  console.log('bytesArrayToString', input)
  return String.fromCharCode.apply(null, input)
}