import generateState from './internal/generateState';
import getEncryptedData from './internal/encryptData';
import getObjParam from './internal/getObjParam';
import getObjSearchParams from './internal/getObjSearchParam';
import getStrErrorMessage from './internal/getStrErrorMessage';
import getStrParam from './internal/getStrParam';
import ls from './internal/secureStorage';
import message from './internal/message';
import passkey from './internal/passkey';
import * as tfa from './internal/twoFactor';
import user from './internal/user';
import validate from './internal/validate';

export default {
  generateState,
  getEncryptedData,
  getObjParam,
  getObjSearchParams,
  getStrErrorMessage,
  getStrParam,
  ls,
  message,
  passkey,
  tfa,
  user,
  validate,
}
