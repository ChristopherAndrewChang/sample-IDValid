import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from 'lodash';

import appConfig from 'src/config/app';
import urlApi from 'src/config/urlApi';
import ls from './internal/secureStorage';
import getSession from './internal/getSession';

const KEY_DEVICE_ID = 'device_id'

type RequestType = {
  method?: string;
  baseURL?: string;
  urlKey?: keyof typeof urlApi;
  url?: string;
  args?: string[];
  usingSession?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: Record<string, any>;
  extra?: any;
  responseType?: 'arraybuffer' | 'document' | 'json' | 'text' | 'stream';
  onBefore?: (options: any) => void | Promise<void>;
  onSuccess?: (responseData: any, extra: any, response: any) => void;
  onFailed?: (error: any, extra: any, rawError: any) => void;
  onBoth?: () => void;
  // [key: string]: any;

  // --------- gunakan jika api membutuhkan verifikasi 2fa ---------
  checkIsAuthorized?: (forceVisibleChildren?: boolean) => Promise<boolean>;
  deniedCallback?: () => void;
}

function getDeviceId() {
  const cookies = document.cookie

  for (let cookie of cookies?.split(';')) {
    const [key, valEncoded] = cookie.trim().split('=')

    if (key === KEY_DEVICE_ID) {
      return decodeURIComponent(valEncoded)
    }
  }

  return uuidv4()
}

// --------- EXTEND THE EXPIRATION TIME OF DEVICE ID COOKIE ---------
async function setCookieDeviceId() {
  const deviceId = getDeviceId()
  const marginExpires = 1000 * 60 * 60 * 24 * 30 * 3
  const cookie = `device_id=${deviceId}; expires=${new Date(Date.now() + marginExpires)}; path=/; domain=${appConfig.url.cookie}; secure`
  // const cookie = `device_id=${deviceId}; expires=${new Date(Date.now() + marginExpires)}; path=/;`
  console.log('setCookieDeviceId', cookie)
  document.cookie = cookie
}

async function request({
  method = 'GET',
  urlKey,
  args = [],
  usingSession = true,
  // headers = {},
  extra,
  onBefore = async () => null,
  onSuccess = () => null,
  onFailed = () => null,
  onBoth = () => null, // harus di panggil setiap kali ada onSuccess atau onFailed di panggil
  ...options
}: RequestType) {
  console.log('request args', arguments)
  // --------- EVERY REQUEST REQUIRES A DEVICE ID ---------
  setCookieDeviceId()

  // --------- VERIFY 2FA ---------
  let isAuthorized = true
  if (options.checkIsAuthorized)
    isAuthorized = await options.checkIsAuthorized(true)

  if (!isAuthorized) {
    if (options.deniedCallback)
      options.deniedCallback()

    return onBoth()
  }

  // --------- REPLACE PATH VARIABLE ---------
  let url = urlApi[urlKey]?.url
  for (let i = 0; i < args.length; i += 1)
    url = url.replace('{}', args[i])

  // --------- SET DEFAULT HEADERS ---------
  if (!options.headers)
    options.headers = {}
  if (usingSession) {
    const userToken = await getSession() // ls.getUserToken()
    console.log('usingSession', usingSession, userToken)
    set(options.headers, 'Authorization', `Bearer ${userToken?.access_token}`)
  }

  // headers.cookie = 'device_id=312aeb1f84b94035b4599ee3d7c14707'

  console.log('headers', options.headers)

  // --------- OVERRIDABLE DEFAULT OPTIONS ---------
  await onBefore(options) // only objects in "options" can be overwritten

  // --------- REQUEST ---------
  return axios({
    method,
    baseURL: appConfig.url.api,
    // url: urlApi[urlKey]?.url,
    url,
    // baseURL: 'https://dev-api.ibes.co.nz/api/profile/qs/',
    headers: options.headers,
    params: options.params,
    data: options.data,
    withCredentials: true, // cookie
  })
    .then((rawRes) => {
      console.log('request then', rawRes)
      onSuccess(rawRes.data, extra, rawRes)
      onBoth()
    })
    .catch((error) => {
      console.log('request catch', error)
      onFailed(get(error, ['response', 'data']), extra, error)
      onBoth()
    })
}

export default request