import getEncryptedData from '../encryptData';
import request from 'src/utils/request';

import type * as types from 'src/constants/types';

export function getIsErrorMultiFactorRequired(rawError: any): boolean {
  return rawError?.response?.status === 403 &&
    rawError?.response?.data?.detail === 'Multi factor session required.'
  // return rawError?.response?.status
  //   ? rawError.response.status === 403
  //   : null
}

export async function readTwoFactorSummary(): Promise<types.TWO_FACTOR_METHOD_SETTINGS> {
  const { headers } = getEncryptedData()

  return new Promise((resolve, reject) => {
    request({
      urlKey: 'auth-multi-factors-summary',
      headers,
      onSuccess: resolve,
      onFailed(error, _, rawError) {
        reject({ error, rawError })
      },
    })
  })
}