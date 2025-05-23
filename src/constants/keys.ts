export default {
  // --------- 2fa ---------
  TWO_FACTOR_METHODS: {
    AUTHENTICATOR: 'authenticator',
    BACKUP_CODE: 'backup_code',
    EMAIL: 'email',
    PASSKEY: 'passkey',
    PHONE: 'phone',
    SECURITY_CODE: 'security_code',
    MOBILE: 'mobile_logged_in',
  } as const,
}