import getEncryptedHeader from './encryptHeader';
import getEncryptedValue from './encryptValue';

/**
 * Logs the provided timestamp, or the current time if none is provided.
 * @param values - Array string values to encrypt, example: [old_password, new_password]
 */
export default function getEncryptedData(values: string[] = []) {
  const timestamp = Math.floor(Date.now() / 1000)

  const encHeaders = getEncryptedHeader(timestamp)
  const encValues = []
  for (const value of values)
    encValues.push(getEncryptedValue(value, timestamp))

  return {
    headers: encHeaders,
    encValues: encValues,
  }
}