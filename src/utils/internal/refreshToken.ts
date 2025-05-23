import getEncryptedData from './encryptData';
import ls from './secureStorage';
import request from '../request';

import type * as types from 'src/constants/types';

export default async function refreshToken(token: types.TOKEN): Promise<types.TOKEN | null> {
  return new Promise((resolve, reject) => {
    const { headers, encValues } = getEncryptedData([token.refresh_id])

    request({
      method: 'post',
      urlKey: 'auth-refresh',
      usingSession: false,
      headers: {
        ...headers,
        Authorization: `Bearer ${token.refresh_token}`,
      },
      data: { refresh: encValues[0] },
      onSuccess: (res) => { // { access_token }
        // --------- MERGE TOKEN ---------
        const updatedToken = { ...token, ...res }

        // --------- SAVE TOKEN TO LOCALSTORAGE ---------
        ls.setUserToken(updatedToken)

        // --------- RETURN VALUE ---------
        resolve(updatedToken)
      },
      onFailed: (error) => {
        reject(error)
      },
    })
  })
}