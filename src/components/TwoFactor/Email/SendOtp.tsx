import { useEffect, useRef, useState } from 'react';
import { App, Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import Icon, { CodeOutlined, MailOutlined } from '@ant-design/icons';

import { lib, request } from 'src/utils';

type PropTypes = {
  setLoading: (loading: boolean) => void;
  onSuccessSendOtp: () => void;
}

export default function TwoFactorEmailSendOtp(props: PropTypes) {
  const { notification } = App.useApp()

  const [loginMethods, setLoginMethods] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState('')
  const [rawError, setRawError] = useState(null)

  const readLoginMethods = () => {
    props.setLoading(true)

    request({
      urlKey: 'auth-user-login-methods',
      onSuccess: (res) => {
        setLoginMethods(res)
        setSelectedEmail(res.email)
      },
      onFailed: (error, _, rawError) => {
        setRawError(rawError)
      },
      onBoth: () => props.setLoading(false),
    })
  }

  const sendEmailOtp = () => {
    props.setLoading(true)

    const { headers } = lib.getEncryptedData()
    request({
      urlKey: 'auth-multi-factors-email',
      headers,
      onSuccess: (res) => {
        props.onSuccessSendOtp()
      },
      onFailed: (error, _, rawError) => {
        notification.error({ key: 'error-send-email-top', message: 'Failed', description: 'Failed to send OTP to your email' })
        props.onSuccessSendOtp()
      },
      onBoth: () => props.setLoading(false),
    })
  }

  useEffect(() => {
    readLoginMethods()
  }, [])

  return (
    <div>
      <div style={{ marginTop: '12px' }}>
        OTP will be sent to email :
        <div>
          <span style={{ fontWeight: 500 }}>
            {selectedEmail}
          </span>
          <span className="link-primary" style={{ marginLeft: '6px' }} onClick={() => notification.info({ key: 'info-no-another-email', message: 'No Another Email', description: 'You only have 1 email' })}>
            (Click to change)
          </span>
        </div>
      </div>
      <Button block type="primary" style={{ marginTop: '12px' }} onClick={sendEmailOtp}>
        Send OTP
      </Button>
    </div>
  )
}