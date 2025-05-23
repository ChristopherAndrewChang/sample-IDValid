export default function stringToBase64(input, safe=false, removePadding=false) {
  let result = btoa(input)
  if (removePadding) {
    result = result.replaceAll("=", "")
  }
  if (safe) {
    result = result.replaceAll("+", "-").replaceAll("/", "_")
  }
  return result
}