import getEncryptedData from 'src/utils/internal/encryptData';
import request from 'src/utils/request';

type ChallengeType = keyof typeof challengeTypes

const challengeTypes = {
  'register': 'auth-security-passkey-register',
  'verify': 'auth-multi-factors-passkey',
} as const

/**
 * @param type - String value, default: "verify"
 */
export default async function getPasskeyChallenge(type: ChallengeType = 'verify') {
  return new Promise((resolve, reject) => {
    const headers = type === 'verify'
      ? getEncryptedData().headers
      : {}

    request({
      urlKey: challengeTypes[type],
      headers,
      onSuccess: resolve,
      onFailed: (error, _, rawError) => reject({ error, rawError }),
    })
  })
}