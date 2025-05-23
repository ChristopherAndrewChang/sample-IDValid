const APP_CONFIG = {
  test: {
    client_id: process.env.REACT_APP_3RD_IDRIS_CLIENT_ID,
  },
  totp: {
    epoch: process.env.REACT_APP_TOTP_EPOCH,
    duration: process.env.REACT_APP_TOTP_DURATION,
    secret: process.env.REACT_APP_TOTP_SECRET,
    digits: process.env.REACT_APP_TOTP_DIGITS,
  },
  auth: {
    loginKey: process.env.REACT_APP_AUTH_LOGIN_KEY,
    platformId: process.env.REACT_APP_AUTH_PLATFORM_ID,
    platformSalt: process.env.REACT_APP_AUTH_PLATFORM_SALT,
    platformKey: process.env.REACT_APP_AUTH_PLATFORM_KEY,
  },
  url: {
    api: process.env.REACT_APP_URL_API,
    cookie: process.env.REACT_APP_COOKIE_DOMAIN,
  },
}

export default APP_CONFIG