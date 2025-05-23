import getEncryptedData from '../encryptData';
import ls from '../secureStorage';
import request from 'src/utils/request';
import ct from 'src/constants';

function clearSession(navigate) {
  ls.deleteUserToken()

  if (navigate)
    navigate(ct.paths.PUBLIC_SIGNIN, { replace: true })
  else
    window.location.href = ct.paths.PUBLIC_SIGNIN
}

export default async function logout(navigate?, preventFailed = false) {
  return new Promise((resolve) => {
    const { headers } = getEncryptedData()
    request({
      method: 'post',
      urlKey: 'auth-logout',
      headers,
      onSuccess: () => clearSession(navigate),
      onFailed: () => {
        if (!preventFailed)
          clearSession(navigate)
      },
      onBoth: () => resolve(null),
    })
  })
}