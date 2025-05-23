export default function base64ToString(input, safe=false) {
  if (safe)
    input = input.replaceAll("-", "+").replaceAll("_", "/")

  return atob(input)
}