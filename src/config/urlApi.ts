export default {
  'tenant-profile': { url: 'tenant/profile/' },
  'tenant-tenants': { url: 'tenant/tenants/' },
  'tenant-users': { url: 'tenant/users/' },

  // 'otp-resend': { url: 'otp/code/{}/' }, // [OTP_ID]
  'otp-apply': { url: 'otp/apply/{}/{}/' }, // [USAGE=email-enrollment, OBJECT_ID] ?ref_id

  'auth-enrollment-email': { url: 'auth/enrollment/email/' },
  'auth-forget-password': { url: 'auth/forget-password/' },
  'auth-forget-password-detail': { url: 'auth/forget-password/{}/' },
  'auth-login': { url: 'auth/login/' },
  'auth-login-email': { url: 'auth/login/email/' },
  // 'auth-login-phone': { url: 'auth/login/phone/' }, // belum digunakan
  'auth-refresh': { url: 'auth/refresh/' },
  'auth-logout': { url: 'auth/logout/' },
  'auth-tenant': { url: 'auth/tenant/' }, // select tenant

  'auth-user-register': { url: 'auth/user/{}/' }, // [ENR_ID]
  'auth-user-password': { url: 'auth/user/change-password/' },

  'auth-user-profile': { url: 'auth/user/profile/' },
  'auth-user-login-methods': { url: 'auth/user/login-methods/' },
  'auth-user-change-email': { url: 'auth/user/change-email/' },
  'auth-user-change-email-detail': { url: 'auth/user/change-email/{}/' }, // verify

  'oauth-user-authorize': { url: 'oauth/user/authorize/' },

  // --------- 2FA MANAGEMENT ---------
  'auth-security-authenticator': { url: 'auth/security/authenticator/' },
  'auth-security-authenticator-detail': { url: 'auth/security/authenticator/{}/' },
  'auth-security-backup-code': { url: 'auth/security/backup-code/' },
  'auth-security-security-code': { url: 'auth/security/security-code/' },
  'auth-security-passkey-register': { url: 'auth/security/passkey/register/' },
  'auth-security-passkey-register-detail': { url: 'auth/security/passkey/register/{}/' },
  'auth-security-passkey': { url: 'auth/security/passkey/' },
  'auth-security-passkey-detail': { url: 'auth/security/passkey/{}/' },

  // --------- 2FA VERIFICATION ONLY ---------
  'auth-multi-factors-summary': { url: 'auth/multi-factors/summary/' },
  'auth-multi-factors-authenticator': { url: 'auth/multi-factors/authenticator/' },
  'auth-multi-factors-authenticator-detail': { url: 'auth/multi-factors/authenticator/{}/' },
  'auth-multi-factors-security-code': { url: 'auth/multi-factors/security-code/' },
  'auth-multi-factors-backup-code': { url: 'auth/multi-factors/backup-code/' },
  'auth-multi-factors-email': { url: 'auth/multi-factors/email/' },
  'auth-multi-factors-passkey': { url: 'auth/multi-factors/passkey/' },
  'auth-multi-factors-passkey-detail': { url: 'auth/multi-factors/passkey/{}/' },
  'auth-multi-factors-mobile': { url: 'auth/multi-factors/mobile/' },
  'auth-multi-factors-mobile-detail': { url: 'auth/multi-factors/mobile/{}/' },

  // --------- third party test trigger from FE - not used in live ---------
  'oauth-token': { url: 'oauth/token/' },
  'oauth-otp-request': { url: 'oauth/otp/request/' },
  'oauth-otp-verify-detail': { url: 'oauth/otp/verify/{}/' },
  'oauth-prompt-request': { url: 'oauth/prompt/request/' },
}