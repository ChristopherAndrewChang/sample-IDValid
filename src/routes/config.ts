import { RouteProps } from 'react-router';

// --------- LAYOUT ---------
import LayoutPublic from 'src/layouts/public';
import LayoutAuth from 'src/layouts/auth';
import LayoutHome from 'src/layouts/home';

// --------- PAGE ---------
import Signup from 'src/pages/registration/signup';
import Login from 'src/pages/registration/signin';
import ForgotPassword from 'src/pages/registration/forgot-password';
import Home from 'src/pages/home';
// import Setting from 'src/pages/setting';
import SecurityCenter from 'src/pages/security-center';
import AccountLoginMethod from 'src/pages/security-center/signin/login-method';
import AccountChangePassword from 'src/pages/security-center/signin/ChangePassword';
import SettingTwoFactorAuthenticator from 'src/pages/security-center/2fa/authenticator';
import SettingTwoFactorBackupCode from 'src/pages/security-center/2fa/backup-code';
import SettingTwoFactorPasskey from 'src/pages/security-center/2fa/passkey';
import SettingTwoFactorPin from 'src/pages/security-center/2fa/pin';
import About from 'src/pages/about';
import Integration from 'src/pages/integration';
import Test from 'src/pages/test';
import UnknownRoute from 'src/pages/Unknown';

// import paths from './paths';
import ct from 'src/constants';

export type RouteType = RouteProps & {
  key: string; // unique string
  routes?: RouteType[];
}

const routes: RouteType[] = [
  {
    key: 'layout-public',
    Component: LayoutPublic,
    routes: [
      {
        key: 'signup',
        path: ct.paths.PUBLIC_SIGNUP,
        Component: Signup,
      },
      {
        key: 'signin',
        path: ct.paths.PUBLIC_SIGNIN,
        Component: Login,
      },
      {
        key: 'forgot-password',
        path: ct.paths.PUBLIC_FORGOTPASSWORD,
        Component: ForgotPassword,
      },
    ],
  },
  {
    key: 'layout-auth',
    path: ct.paths.MAIN,
    Component: LayoutAuth,
    routes: [
      {
        key: 'layout-home',
        path: ct.paths.MAIN,
        Component: LayoutHome,
        routes: [
          // --------- SIDER MENU ---------
          {
            key: 'home',
            index: true,
            Component: Home,
          },
          {
            key: 'security-center',
            path: ct.paths.MAIN_HOME_SECURITY,
            Component: SecurityCenter,
          },
          {
            key: 'about',
            path: ct.paths.MAIN_HOME_ABOUT,
            Component: About,
          },
          // --------- Login Method ---------
          {
            key: 'login-method',
            path: ct.paths.MAIN_HOME_SECURITY_ACCOUNT_EMAIL,
            Component: AccountLoginMethod,
          },
          {
            key: 'change-password',
            path: ct.paths.MAIN_HOME_SECURITY_ACCOUNT_PASSWORD,
            Component: AccountChangePassword,
          },
          // --------- 2FA ---------
          {
            key: '2fa-authenticator',
            path: ct.paths.MAIN_HOME_SECURITY_2FA_AUTHENTICATOR,
            Component: SettingTwoFactorAuthenticator,
          },
          {
            key: '2fa-backup-code',
            path: ct.paths.MAIN_HOME_SECURITY_2FA_BACKUPCODE,
            Component: SettingTwoFactorBackupCode,
          },
          {
            key: '2fa-passkey',
            path: ct.paths.MAIN_HOME_SECURITY_2FA_PASSKEY,
            Component: SettingTwoFactorPasskey,
          },
          {
            key: '2fa-pin',
            path: ct.paths.MAIN_HOME_SECURITY_2FA_PIN,
            Component: SettingTwoFactorPin,
          },
        ],
      },
      {
        key: 'integration',
        path: ct.paths.MAIN_INTEGRATION,
        Component: Integration,
      },
      {
        key: 'test',
        path: '/test',
        Component: Test,
      },
    ],
  },
  {
    key: 'unknown',
    path: '*',
    Component: UnknownRoute,
  },
]

export default routes