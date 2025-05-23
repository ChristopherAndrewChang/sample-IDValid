import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { App, Button, Card, Col, Form, Input, Popconfirm, Row, Spin } from 'antd';
import { CheckCircleOutlined, CheckCircleTwoTone, CodeOutlined, EditOutlined, SafetyCertificateTwoTone, SafetyOutlined, SwitcherOutlined } from '@ant-design/icons';

import { cards, ctx, PageError } from 'src/components';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import type * as types from 'src/constants/types';
import DialogSettingTwoFactorPinSetup from './Setup';

export default function SettingTwoFactorPin() {
  const navigate = useNavigate()
  const { notifError } = ctx.useNotif()
  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()
  const { notification } = App.useApp()

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
      })
      .finally(() => setLoading(false))
  }

  const readSuccess = (res: types.TWO_FACTOR_METHOD_SETTINGS) => {
    setRawError(null)
    setTwoFactorSummary(res)

    if (!res.security_code)
      setIsConfigure(true)
  }

  const disablePin = () => {
    setLoading(true)
    request({
      checkIsAuthorized,
      onBefore: (options) => {
        const { headers } = lib.getEncryptedData()
        options.headers = { ...options.headers, ...headers }
      },
      // deniedCallback: () => notification.info({ message: 'Action Cancelled', description: 'Disabling PIN was canceled due to failed 2FA verification' }),
      method: 'delete',
      urlKey: 'auth-security-security-code',
      onSuccess(responseData, extra, response) {
        notification.success({ message: 'PIN successfully deleted.', description: 'You cannot use a PIN as 2FA verification.' })
        navigate(ct.paths.MAIN_HOME_SECURITY)
      },
      onFailed: (error, _, rawError) => notifError(rawError, { key: 'disable-pin-failed', message: 'Disable Failed' }),
      onBoth: () => setLoading(false),
    })
  }

  useEffect(readTwoFactorSummary, [])

  console.log('Rendered 2FA PIN', { twoFactorSummary })

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '24px' }}>
        {twoFactorSummary.security_code && (
          <cards.List
            cardProps={{
              style: {marginTop: 0},
            }}
          >
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
                        title="Are you sure want to DISABLE 2FA PIN?"
                        okButtonProps={{ danger: true }}
                        onConfirm={disablePin}
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
        {twoFactorSummary.security_code && (
          <cards.List title="Security Code (PIN)">
            <div style={{ padding: '12px' }}>
              <div style={{ margin: '12px' }}>
                <Row align="middle" style={{ flexDirection: 'column' }}>
                  {/* <SafetyOutlined style={{ color: '#52c41a', fontSize: '48px' }} /> */}
                  <SafetyCertificateTwoTone twoToneColor="#52c41a" style={{ fontSize: '48px' }} />
                  {/* <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '48px' }} /> */}
                  {/* <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '48px' }} /> */}
                  <div style={{ color: '#52c41a', fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
                    Configured
                  </div>
                </Row>
              </div>
            </div>
          </cards.List>
        )}
        {isConfigure && (
          <DialogSettingTwoFactorPinSetup
            onClose={(success) => {
              setIsConfigure(false)

              if (success)
                readTwoFactorSummary()
              else if (!twoFactorSummary.security_code)
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