import { useRef } from 'react';
import { Button, Card, Col, Form, Input, notification, Row, Typography } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

import ctx from '../context';
import { lib, request } from 'src/utils';

import type { VERIFY_2FA_CONTENT_PROPS } from './propTypes';

export default function TwoFactorPin(props: VERIFY_2FA_CONTENT_PROPS) {
  const _form = useRef<any>(null)
  const { notifError } = ctx.useNotif()

  const verifyPin = (pin: string) => {
    props.setLoading(true)

    const { headers } = lib.getEncryptedData()
    request({
      method: 'post',
      urlKey: 'auth-multi-factors-security-code',
      headers,
      data: { pin },
      onSuccess: (responseData) => props.onClose(true, responseData),
      onFailed(responseData, extra, rawError) {
        notifError(rawError, { key: '2fa-pin-failed' })
        _form.current.resetFields()
      },
      onBoth: () => props.setLoading(false),
    })

    return ''
  }

  return (
    <Card>
      <Row align="middle" style={{ flexDirection: 'column' }}>
        <CodeOutlined style={{ fontSize: '48px' }} />
        <div style={{ fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
          PIN Verification
        </div>
      </Row>
      <div style={{ marginTop: '12px' }}>
        <Form ref={_form} layout="vertical">
          <Form.Item name="pin" getValueFromEvent={(value) => verifyPin(value)} style={{ marginBottom: 0 }}>
            <Input.OTP
              autoFocus
              mask="⬤"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </div>
    </Card>
  )
}