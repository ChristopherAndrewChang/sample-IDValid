import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { App, Button, Card, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { CheckCircleOutlined, CheckCircleTwoTone, CodeOutlined, SafetyCertificateTwoTone, SafetyOutlined, SwitcherOutlined } from '@ant-design/icons';

import { cards, ctx } from 'src/components';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import type * as types from 'src/constants/types';

type PropTypes = {
  onClose: (success?: boolean) => void;

  visible?: boolean;
}

export default function DialogSettingTwoFactorPinSetup({
  visible = true,
  onClose,
}: PropTypes) {
  const _form = useRef<any>(null)
  const { message, notification } = App.useApp()
  const { isAuthorized, checkIsAuthorized, validateError } = ctx.tfa.useTwoFactorContext()
  const [loading, setLoading] = useState(false)
  const [temporaryPin, setTemporaryPin] = useState('')
  const [visibleInput, setVisibleInput] = useState(false)

  const onChangeTemporaryPin = (pin: string) => {
    setLoading(true)

    setTimeout(() => {
      setTemporaryPin(pin)
      setLoading(false)
    }, 500)
  }

  const resetValues = () => {
    setLoading(false)
    setTemporaryPin('')

    if (_form.current)
      _form.current.resetFields()
  }

  const savePinFailed = () =>
    notification.error({ message: 'Failed', description: 'PIN failed to save.' })

  const savePin = (pin: string) => {
    setLoading(true)

    if (pin !== temporaryPin) {
      setTimeout(() => {
        resetValues()
        notification.error({ message: 'Failed', description: 'The PINs do not match, please try again.' })
      }, 500)

      return
    }

    request({
      checkIsAuthorized,
      onBefore: (options) => {
        const { headers } = lib.getEncryptedData()
        options.headers = { ...options.headers, ...headers }
      },
      deniedCallback: savePinFailed,
      method: 'put',
      urlKey: 'auth-security-security-code',
      // headers,
      data: { new_pin: pin },
      onSuccess(responseData, extra, response) {
        notification.success({ message: 'PIN Saved', description: 'Your new PIN has been saved.' })
        onClose(true)
      },
      onFailed: savePinFailed,
      onBoth: resetValues,
    })
  }

  useEffect(() => {
    if (visible)
      checkIsAuthorized(true)
        .then((isAuthorized) => !isAuthorized && onClose())
  }, [visible])

  return isAuthorized && (
    <Modal
      open={visible}
      title="Configure PIN"
      footer={null}
      afterOpenChange={setVisibleInput}
      onCancel={() => {
        if (loading)
          return message.info('You can close this dialog once the process is complete.')

        onClose()
      }}
    >
      <Spin spinning={loading}>
        <div style={{ padding: '12px' }}>
          <div style={{ margin: '12px' }}>
            <Row align="middle" style={{ flexDirection: 'column' }}>
              <CodeOutlined style={{ fontSize: '48px' }} />
              <div style={{ fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
                Input 6-digit PIN {temporaryPin && 'again'}
              </div>
            </Row>
            <div style={{ marginTop: '12px' }}>
              <Form ref={_form} layout="vertical">
                {visibleInput && (
                  <div>
                    <div style={{ marginTop: '12px' }}>
                      <Form.Item name="pin" getValueFromEvent={onChangeTemporaryPin} style={{ marginBottom: 0 }}>
                        <Input.OTP
                          autoFocus
                          disabled={!!temporaryPin}
                          mask="⬤"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </div>
                    {!!temporaryPin && (
                      <div style={{ marginTop: '12px' }}>
                        <Form.Item name="confirm-pin" getValueFromEvent={savePin} style={{ marginBottom: 0 }}>
                          <Input.OTP
                            autoFocus
                            mask="⬤"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </div>
                    )}
                  </div>
                )}
              </Form>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontWeight: 500 }}>
                Create a 6-digit PIN for quick and secure access to your account.
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}