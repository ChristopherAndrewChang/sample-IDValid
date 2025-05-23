import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { App, Button, Col, Popconfirm, Row, Spin } from 'antd';
import { EditOutlined, SafetyCertificateTwoTone, SwitcherOutlined } from '@ant-design/icons';

import DialogTwoFactorAuthenticatorSetup from './Setup';
import { cards, ctx, PageError } from 'src/components';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import type * as types from 'src/constants/types';

export default function SettingTwoFactorAuthenticator() {
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()

  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [twoFactorSummary, setTwoFactorSummary] = useState<types.TWO_FACTOR_METHOD_SETTINGS>(ct.def.DEFAULT_TWO_FACTOR_METHOD_SETTINGS)
  const [isConfigure, setIsConfigure] = useState(false)

  const readTwoFactorSummary = () => {
    setLoading(true)

    lib.tfa.readTwoFactorSummary()
      .then(readSuccess)
      .catch(({ rawError }) => {
        setRawError(rawError)
        setTwoFactorSummary(ct.def.DEFAULT_TWO_FACTOR_METHOD_SETTINGS)
        // setTwoFactorSummary({ ...ct.def.DEFAULT_TWO_FACTOR_METHOD_SETTINGS, authenticator: true})
      })
      .finally(() => setLoading(false))
  }

  const readSuccess = (res: types.TWO_FACTOR_METHOD_SETTINGS) => {
    setRawError(null)
    setTwoFactorSummary(res)

    if (!res.authenticator)
      setIsConfigure(true)
  }

  const disableAuthenticator = async () => {
    const isAuthorized = await checkIsAuthorized(true)
    if (!isAuthorized)
      return

    setLoading(true)

    request({
      checkIsAuthorized,
      onBefore: (options) => {
        const { headers } = lib.getEncryptedData()
        options.headers = { ...options.headers, ...headers }
      },
      method: 'delete',
      urlKey: 'auth-security-authenticator',
      onSuccess(responseData, extra, response) {
        notification.success({ message: 'Authenticator App successfully disabled.', description: 'You cannot use a Authenticator App as 2FA verification.' })
        navigate(ct.paths.MAIN_HOME_SECURITY)
      },
      onFailed(responseData, extra, response) {
        console.log('onFailed', response)
        notification.error({ message: 'Failed', description: 'Failed to disable Authenticator App.' })
      },
      onBoth: () => setLoading(false),
    })
  }

  useEffect(readTwoFactorSummary, [])

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '24px' }}>
        {twoFactorSummary.authenticator && (
          <cards.List cardProps={{ style: {marginTop: 0} }}>
            <div style={{ padding: '12px' }}>
              <Row justify="space-between">
                <Col>
                </Col>
                <Col>
                  <Row gutter={[12, 0]}>
                    <Col>
                      <Button icon={<EditOutlined />} onClick={() => setIsConfigure(true)}>
                        Reconfigure
                      </Button>
                    </Col>
                    <Col>
                      <Popconfirm
                        placement="bottomRight"
                        title="Are you sure want to DISABLE 2FA Authenticator?"
                        okButtonProps={{ danger: true }}
                        onConfirm={disableAuthenticator}
                      >
                        <Button danger type="primary" icon={<SwitcherOutlined />}>
                          Disable
                        </Button>
                      </Popconfirm>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </cards.List>
        )}
        {twoFactorSummary.authenticator && (
          <cards.List title="Authenticator app">
            <div style={{ padding: '12px' }}>
              <div style={{ margin: '12px' }}>
                <Row align="middle" style={{ flexDirection: 'column' }}>
                  <SafetyCertificateTwoTone twoToneColor="#52c41a" style={{ fontSize: '48px' }} />
                  <div style={{ color: '#52c41a', fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
                    Configured
                  </div>
                </Row>
              </div>
            </div>
          </cards.List>
        )}
        {isConfigure && (
          <DialogTwoFactorAuthenticatorSetup
            onClose={(success) => {
              setIsConfigure(false)

              if (success)
                readTwoFactorSummary()
              else if (!twoFactorSummary.authenticator)
                navigate(-1)
            }}
          />
        )}
        {rawError && (
          <cards.List cardProps={{ style: {marginTop: 0} }}>
            <PageError
              rawError={rawError}
              onReload={readTwoFactorSummary}
            />
          </cards.List>
        )}
      </div>
    </Spin>
  )
}