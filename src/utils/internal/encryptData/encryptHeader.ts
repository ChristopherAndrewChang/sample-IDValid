import CryptoJS from 'crypto-js';
import forge from 'node-forge';

import appConfig from 'src/config/app';
import { base64ToBytesArray, bytesArrayToBase64, bytesArrayToString, packUInt32, packUInt64BigEndian, packWordArrayBigEndian, randomBytesArray, stringToBase64 } from './internal';

type ENCRYPTED_HEADER_TYPE = {
  'X-IDV-TS': string;
  'X-IDV-NC': string;
  'X-IDV-SLT': string;
  'X-IDV-PF': string;
}

/**
 * Logs the provided timestamp, or the current time if none is provided.
 * @param timestamp - The timestamp in seconds (defaults to `Math.floor(Date.now() / 1000)`)
 */
export default function getEncryptedHeader(timestamp: number = Math.floor(Date.now() / 1000)): ENCRYPTED_HEADER_TYPE {
  console.log('getEncryptedHeader', timestamp)
  const totpEpoch = Number(appConfig.totp.epoch)
  const totpDuration = Number(appConfig.totp.duration)
  const totpSecret = appConfig.totp.secret
  const totpDigits = Number(appConfig.totp.digits)

  const authLoginKey = appConfig.auth.loginKey
  const authPlatformId = appConfig.auth.platformId

  const sequence = Math.floor(
    (timestamp - totpEpoch) / 
    (totpDuration)
  )

  console.log('sequence', sequence)

  const digest = packWordArrayBigEndian(
    CryptoJS.HmacSHA1(
      CryptoJS.lib.WordArray.create(
        packUInt64BigEndian(sequence)), 
      CryptoJS.lib.WordArray.create(
        base64ToBytesArray(totpSecret))
    )
  )

  const offset = digest[digest.length - 1] & 0xF
  const code = (
    ((digest[offset] & 0x7F) << 24) |
    ((digest[offset + 1] & 0xFF) << 16) |
    ((digest[offset + 2] & 0xFF) << 8) |
    (digest[offset + 3] & 0xFF)
  ) % (Math.pow(10, totpDigits))

  const salt = bytesArrayToString(randomBytesArray(21))
  console.log('getEncryptedHeader salt', salt)

  const authLoginPublicKey = forge.pki.publicKeyFromPem(authLoginKey)
  const encryptedPlatformId = authLoginPublicKey.encrypt(
    authPlatformId,
    'RSA-OAEP',
    {
      md: forge.md.sha256.create(),
      label: salt,
      mgf1: {
        md: forge.md.sha256.create()
      }
    }
  )

  return {
    'X-IDV-TS': bytesArrayToBase64(packUInt32(timestamp, false), true, true),
    'X-IDV-NC': bytesArrayToBase64(packUInt32(code, false), true, true),
    'X-IDV-SLT': stringToBase64(salt, true, true),
    'X-IDV-PF': stringToBase64(encryptedPlatformId, true, true),
  }
}