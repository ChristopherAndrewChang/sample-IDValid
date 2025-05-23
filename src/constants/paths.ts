export default {
  // --------- ALL USER CAN ACCESS ---------
  PUBLIC_SIGNUP: '/signup',
  PUBLIC_SIGNIN: '/signin',
  PUBLIC_FORGOTPASSWORD: '/forgot-password',
  // --------- AUTHENTICATED USER ONLY ---------
  MAIN: '/',
  // MAIN_HOME: '/',
  // MAIN_HOME_SETTING: '/setting',
  MAIN_HOME_SECURITY: '/security-center',
  MAIN_HOME_SECURITY_ACCOUNT_EMAIL: '/security-center/account/email',
  MAIN_HOME_SECURITY_ACCOUNT_PASSWORD: '/security-center/account/change-password',
  MAIN_HOME_SECURITY_2FA_AUTHENTICATOR: '/security-center/tfa/authenticator',
  MAIN_HOME_SECURITY_2FA_BACKUPCODE: '/security-center/tfa/backup-code',
  MAIN_HOME_SECURITY_2FA_PASSKEY: '/security-center/tfa/passkey',
  MAIN_HOME_SECURITY_2FA_PIN: '/security-center/tfa/pin',
  MAIN_HOME_ABOUT: '/about',
  MAIN_INTEGRATION: '/integration',
}