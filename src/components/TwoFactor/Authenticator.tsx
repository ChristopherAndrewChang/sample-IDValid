import { useRef } from 'react';
import { Button, Card, Col, Form, Input, notification, Row, Typography } from 'antd';
import { CodeOutlined, ProfileOutlined, TabletOutlined } from '@ant-design/icons';

import ctx from '../context';
import { lib, request } from 'src/utils';

import type { VERIFY_2FA_CONTENT_PROPS } from './propTypes';

export default function TwoFactorAuthenticator(props: VERIFY_2FA_CONTENT_PROPS) {
  const _form = useRef<any>(null)
  const { notifError } = ctx.useNotif()

  const verifyCode = () => {
    _form.current.validateFields().then(values => {
      props.setLoading(true)

      const { headers } = lib.getEncryptedData()
      request({
        method: 'post',
        urlKey: 'auth-multi-factors-authenticator',
        headers,
        data: { pin: values.code },
        onSuccess: (responseData, extra, response) => props.onClose(true, responseData),
        onFailed: (responseData, extra, rawError) => {
          notifError(rawError, null, _form.current)
          _form.current.resetFields()
        },
        onBoth: () => props.setLoading(false),
      })
    })
  }

  return (
    <Card>
      <Row align="middle" style={{ flexDirection: 'column' }}>
        <TabletOutlined style={{ fontSize: '48px' }} />
        <div style={{ fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
          Authenticator code
        </div>
      </Row>
      <div style={{ marginTop: '12px' }}>
        <Form ref={_form} layout="vertical">
          <Form.Item name="code" style={{ marginBottom: 0 }}>
            <Input
              autoFocus
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </div>
      <div style={{ marginTop: '12px' }}>
        <Button block type="primary" onClick={verifyCode}>
          Verify
        </Button>
      </div>
    </Card>
  )
}