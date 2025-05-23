import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

import ls from './secureStorage';
import refreshToken from './refreshToken';

import type * as types from 'src/constants/types';

const MARGIN_EXPIRED = 1000 * 3

// 
export default async function getSession(): Promise<types.TOKEN | null> {
  let userToken = ls.getUserToken()
  if (!userToken)
    return null

  const objAccessToken = jwtDecode<types.ACCESS_TOKEN>(userToken.access_token)
  console.log(
    'expires token',
    moment(objAccessToken.exp * 1000 - MARGIN_EXPIRED).format() <= moment().format(),
    moment(objAccessToken.exp * 1000).format(),
    { userToken, ...objAccessToken },
  )

  // --------- CHECKING EXPIRES TOKEN ---------
  if (moment(objAccessToken.exp * 1000 - MARGIN_EXPIRED).format() <= moment().format()) {
    // --------- REFRESH TOKEN ---------
    userToken = await refreshToken(userToken).catch(() => null) // { access_token }
    // if (newUserToken)
    //   userToken = {...userToken, ...newUserToken}
  }

  console.log('getSession', userToken)
  return userToken
}