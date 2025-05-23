import CryptoJS from 'crypto-js';
import forge from 'node-forge';

import appConfig from 'src/config/app';
import { base64ToBytesArray, bytesArrayToString, packUInt64BigEndian, packWordArrayBigEndian, stringToBase64 } from './internal';

/**
 * Logs the provided timestamp, or the current time if none is provided.
 * @param password - String value to encrypt
 * @param timestamp - The timestamp in seconds (defaults to `Math.floor(Date.now() / 1000)`)
 */
export default function getEncryptedValue(password: string, timestamp: number = Math.floor(Date.now() / 1000)): string {
  console.log('getEncryptedValue', {timestamp, password})
  const authPlatformKey = appConfig.auth.platformKey
  const authPlatformSalt = appConfig.auth.platformSalt

  console.log('getEncryptedValue', {authPlatformKey, authPlatformSalt})

  console.log('here 1', packUInt64BigEndian(timestamp))
  console.log('here 2', base64ToBytesArray(authPlatformSalt))

  const passwordLabel = packWordArrayBigEndian(
    CryptoJS.HmacSHA256(
      CryptoJS.lib.WordArray.create(
        packUInt64BigEndian(timestamp)),
      CryptoJS.lib.WordArray.create(
        base64ToBytesArray(authPlatformSalt))
    )
  )

  console.log('getEncryptedValue passwordLabel', passwordLabel)

  const platformPublicKey = forge.pki.publicKeyFromPem(authPlatformKey)
  const authLoginPassword = password // 'my password'
  const encryptedPassword = platformPublicKey.encrypt(
    authLoginPassword,
    'RSA-OAEP',
    {
      md: forge.md.sha256.create(),
      label: bytesArrayToString(passwordLabel),
      mgf1: {
        md: forge.md.sha256.create()
      }
    }
  )

  return stringToBase64(encryptedPassword, true, true)
}