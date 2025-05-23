import { cloneDeep } from 'lodash';

import { base64ToBytesArray } from '../encryptData/internal';

export default function getOptGet(challengeRegister: any) {
  challengeRegister = cloneDeep(challengeRegister)

  challengeRegister.publicKey.challenge = base64ToBytesArray(challengeRegister.publicKey.challenge, true)
  for (const item of challengeRegister.publicKey.allowCredentials)
    item.id = base64ToBytesArray(item.id, true)

  return challengeRegister
}