import keys from './keys';

import type * as types from './types';

// --------- ordered by preferred ---------
const TWO_FACTOR_METHODS: types.TWO_FACTOR_METHOD_ITEM[] = [
  {
    key: keys.TWO_FACTOR_METHODS.PASSKEY,
    label: 'Passkey',
  },
  {
    key: keys.TWO_FACTOR_METHODS.SECURITY_CODE,
    label: 'PIN',
  },
  {
    key: keys.TWO_FACTOR_METHODS.MOBILE,
    label: 'IDValid Mobile',
  },
  {
    key: keys.TWO_FACTOR_METHODS.AUTHENTICATOR,
    label: 'Google Auth',
  },
  {
    key: keys.TWO_FACTOR_METHODS.EMAIL,
    label: 'OTP Email',
  },
  {
    key: keys.TWO_FACTOR_METHODS.BACKUP_CODE,
    label: 'Backup Code',
  },
]

export default {
  TWO_FACTOR_METHODS,
}