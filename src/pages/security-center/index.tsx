import { useEffect, useState } from 'react';
import { App, Button, Card, Col, Dropdown, Row, Spin } from 'antd';
import { CodeOutlined, EditOutlined, LaptopOutlined, LoginOutlined, MoreOutlined, ProfileOutlined, RightOutlined, RobotOutlined, ShakeOutlined, TabletOutlined, UsbOutlined } from '@ant-design/icons';

import PasskeyIcon from 'src/components/TwoFactor/PasskeyIcon';
import { cards, ctx, PageError } from 'src/components';
import ct from 'src/constants';

export default function SecurityCenter() {
  const { notification } = App.useApp()

  const { twoFactorSummary, readSummary } = ctx.tfa.useTwoFactorContext()
  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)

  const methodItems = [
    {
      key: 'login-method',
      name: 'Login Methods',
      description: 'Manage email for login method',
      icon: <LoginOutlined />,
      path: ct.paths.MAIN_HOME_SECURITY_ACCOUNT_EMAIL,
    },
    {
      key: 'login-password',
      name: 'Login Password',
      description: 'Click to change your password',
      icon: <UsbOutlined />,
      path: ct.paths.MAIN_HOME_SECURITY_ACCOUNT_PASSWORD,
    },
  ]

  const twoFactorItems = [
    {
      key: '2fa-otp',
      configured: twoFactorSummary.email,
      name: 'OTP (One-Time Password)',
      description: 'Receive a temporary code sent to your email for secure authentication.',
      icon: <RobotOutlined />,
      onClick: () => notification.info({ key: 'warn-otp', message: 'Information', description: 'Change email via the "Login Method" menu' }),
    },
    {
      key: '2fa-passkey',
      configured: twoFactorSummary.passkey,
      name: 'Passkey',
      description: 'Complete identity verification through device fingerprint, facial recognition or another device verification.',
      icon: <PasskeyIcon style={{ fontSize: '18px' }} />,
      path: ct.paths.MAIN_HOME_SECURITY_2FA_PASSKEY,
    },
    {
      key: '2fa-pin',
      configured: twoFactorSummary.security_code,
      name: 'Security Code (PIN)',
      description: 'Set and manage a personal PIN for quick and secure access to your account.',
      icon: <CodeOutlined />,
      path: ct.paths.MAIN_HOME_SECURITY_2FA_PIN,
    },
    {
      key: '2fa-authenticator',
      configured: twoFactorSummary.authenticator,
      name: 'Authenticator app',
      description: 'Use an authentication app or browser extension to get two-factor authentication codes when prompted.',
      icon: <TabletOutlined />,
      path: ct.paths.MAIN_HOME_SECURITY_2FA_AUTHENTICATOR,
    },
    {
      key: '2fa-backupcode',
      configured: twoFactorSummary.backup_code,
      name: 'Backup Codes',
      description: 'Generate and store backup codes to access your account if you lose access to other verification methods.',
      icon: <ProfileOutlined />,
      path: ct.paths.MAIN_HOME_SECURITY_2FA_BACKUPCODE,
    },
  ]

  const readTwoFactorSummary = () => {
    setLoading(true)

    readSummary()
      .then(() => setRawError(null))
      .catch(({ rawError }) => setRawError(rawError))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    readTwoFactorSummary()
  }, [])

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '12px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 48px' }}>
          {rawError ? (
            <cards.List>
              <PageError
                rawError={rawError}
                onReload={readTwoFactorSummary}
              />
            </cards.List>
          ) : (
            <div style={{ maxWidth: '840px' }}>
              <cards.List
                title="Account Protection"
                description="Settings for logging into your account"
                items={methodItems}
              />

              <cards.List
                title="Two Factor Authentication"
                // description="Settings for logging into your account"
                items={twoFactorItems}
              />
            </div>
          )}
        </div>
      </div>
    </Spin>
  )
}