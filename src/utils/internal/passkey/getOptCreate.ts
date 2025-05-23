import { cloneDeep } from 'lodash';

import { base64ToBytesArray } from '../encryptData/internal';

export default function getOptCreate(challengeRegister: any) {
  challengeRegister = cloneDeep(challengeRegister)

  challengeRegister.publicKey.challenge = base64ToBytesArray(challengeRegister.publicKey.challenge, true)
  challengeRegister.publicKey.user.id = base64ToBytesArray(challengeRegister.publicKey.user.id, true)
  for (const item of challengeRegister.publicKey.excludeCredentials)
    item.id = base64ToBytesArray(item.id, true)

  return challengeRegister
}