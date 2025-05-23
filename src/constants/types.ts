import keys from './keys';

type BASE_OBJ_TOKEN = {
  sub: number;
  aud: string;
  exp: number;
  iat: number;
  sid: number;
  jti: string;
  iss: string;
  // --------- additional ---------
  pft?: string;
  rti?: number;
  tty?: string;
}

export type ACCESS_TOKEN = BASE_OBJ_TOKEN & {
  mfa?: boolean;
  mfe?: number;
}

export type REFRESH_TOKEN = BASE_OBJ_TOKEN & {}

export type TOKEN = {
  access_token: string;
  refresh_id: string;
  refresh_token: string;
}

export type THIRD_APP_DETAIL = {
  client_name: string;
  scopes: string[];
}

// --------- 2FA ---------
export type TWO_FACTOR_METHOD =
  typeof keys.TWO_FACTOR_METHODS[keyof typeof keys.TWO_FACTOR_METHODS]

export type TWO_FACTOR_METHOD_SETTINGS = {
  [key in TWO_FACTOR_METHOD]: boolean;
}

export type TWO_FACTOR_METHOD_ITEM = {
  key: TWO_FACTOR_METHOD;
  label: string;
}

// --------- EMAIL ENROLLMENT ---------
export type ENROLL_INPUT_EMAIL = {
  id: string;
  email_id: string;
}

export type ENROLL_OTP_EMAIL = {
  id: string;
  token: string;
}

export type ENROLL_CHANGE_EMAIL = {
  id: string;
  ref_id: string;
}