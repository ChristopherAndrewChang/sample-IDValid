import getEncryptedData from 'src/utils/internal/encryptData';
import request from 'src/utils/request';

type PasskeyType = 'register' | 'verify'

const challengeTypes = {
  'register': 'auth-security-passkey-register-detail',
  'verify': 'auth-multi-factors-passkey-detail',
} as const

export default async function verifyPasskey(challengeId: string, data: any, type: PasskeyType = 'verify') {
  console.log('verifyPasskey', challengeId, {type, data})
  return new Promise((resolve, reject) => {
    const headers = type === 'verify'
      ? getEncryptedData().headers
      : {}

      request({
        method: 'post',
        urlKey: challengeTypes[type],
        args: [challengeId],
        headers,
        data,
        onSuccess: (res) => resolve(res),
        onFailed: (error, _, rawError) => {
          reject({ error, rawError })
        },
      })
    })
}