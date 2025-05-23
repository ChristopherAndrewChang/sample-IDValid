export default function getStrParam(obj) {
  let queryString = ''

  for (const key in obj) {
    if (typeof obj[key] === 'undefined') continue
    if (!obj[key] && typeof obj[key] === 'object') obj[key] = ''

    if (!queryString) queryString += '?'
    else queryString += '&'

    queryString += `${key}=${encodeURIComponent(obj[key])}`
  }

  return queryString
}