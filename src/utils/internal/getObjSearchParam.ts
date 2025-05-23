export default function getObjSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const objSearchParams = {}

  for (const [key, value] of searchParams.entries())
    objSearchParams[key] = value
  
  return objSearchParams
}