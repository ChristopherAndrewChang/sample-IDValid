import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Input, notification, Row, Typography } from 'antd';
import Icon, { CodeOutlined, MailOutlined } from '@ant-design/icons';

import TwoFactorEmailSendOtp from './SendOtp';
import TwoFactorEmailConfirmOtp from './ConfirmOtp';
import { lib, request } from 'src/utils';
import getEncryptedData from 'src/utils/internal/encryptData';

import type { VERIFY_2FA_CONTENT_PROPS } from '../propTypes';

export default function TwoFactorEmail(props: VERIFY_2FA_CONTENT_PROPS) {
  const [isOtpSent, setIsOtpSent] = useState(false)

  return (
    <Card>
      <Row align="middle" style={{ flexDirection: 'column' }}>
        <MailOutlined style={{ fontSize: '48px' }} />
        <div style={{ fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
          OTP Email
        </div>
      </Row>
      {isOtpSent
        ? <TwoFactorEmailConfirmOtp
          setLoading={props.setLoading}
          onVerified={(token) => props.onClose(true, token)}
        />
        : <TwoFactorEmailSendOtp
          setLoading={props.setLoading}
          onSuccessSendOtp={() => setIsOtpSent(true)}
        />}
    </Card>
  )
}