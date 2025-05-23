export default function getObjParam(strParam): Record<string, string> {
  if (typeof strParam !== 'string') return

  const obj = {}
  try {
    const urlSearchParams = new URLSearchParams(strParam)

    urlSearchParams.forEach(function(value, key) {obj[key] = value})
  } catch(e) {}

  return obj
}