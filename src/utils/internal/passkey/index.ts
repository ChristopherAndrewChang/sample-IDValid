import getOptCreate from './getOptCreate';
import getOptGet from './getOptGet';
import getPasskeyChallenge from './getChallenge';
import verifyPasskey from './verify';

const MESSAGE_NOT_SUPPORTED = 'Passkey not supported'

function isSupported() {
  return true
}

async function register() {
  return new Promise(async (resolve, reject) => {
    getPasskeyChallenge('register')
      .then((challenge: any) => navigator.credentials.create(getOptCreate(challenge))
        .then(passkeyCredential => verifyPasskey(challenge.id, passkeyCredential, 'register')))
      .then(() => resolve(true))
      .catch((obj) => reject(obj.rawError || obj))
      .finally(() => reject('Register Passkey unhandled rejection'))
  })
}

async function verify() {
  return new Promise(async (resolve, reject) => {
    getPasskeyChallenge()
      .then((challenge: any) => navigator.credentials.get(getOptGet(challenge))
        .then(passkeyCredential => verifyPasskey(challenge.id, { cred: passkeyCredential })))
      .then((token) => resolve(token))
      .catch((obj) => reject(obj.rawError || obj))
      .finally(() => reject('Register Passkey unhandled rejection'))
  })
}

export default {
  register,
  verify,
}