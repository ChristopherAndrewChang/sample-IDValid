import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { App, Button, Card, Col, Form, Input, Popconfirm, Row, Spin } from 'antd';

import { lib, request } from 'src/utils';
import ct from 'src/constants';
import { CheckOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import DialogEmailConfirm from './EmailConfirm';

import type * as types from 'src/constants/types';
import { ctx } from 'src/components';

type PropTypes = {
  resEnrollEmail: types.ENROLL_INPUT_EMAIL;
  resOtpEmail: types.ENROLL_OTP_EMAIL;
  setLoading: (loading: boolean) => void;
  generateState: () => string;
  setResEnrollEmail: (resEnrollEmail: types.ENROLL_INPUT_EMAIL) => void;
  setResOtpEmail: (resOtpEmail: types.ENROLL_OTP_EMAIL) => void;
  reset: () => void;
}

export default function FieldEmail(props: PropTypes) {
  const form = Form.useFormInstance()
  const _sendingOtp = useRef(false)
  const { notifError } = ctx.useNotif()

  const [visibleDialogConfirm, setVisibleDialogConfirm] = useState(false)

  const isDisabled = () =>
    !!props.resOtpEmail || _sendingOtp.current

  const sendOtp = () => {
    if (isDisabled())
      return

    form.validateFields().then(values => {
      _sendingOtp.current = true
      props.setLoading(true)

      request({
        usingSession: false,
        method: 'post',
        urlKey: 'auth-enrollment-email',
        data: { email: values.email, state: props.generateState() },
        onSuccess: (res) => {
          setVisibleDialogConfirm(true)
          props.setResEnrollEmail(res)
        },
        onFailed: (error, _, rawError) => {
          notifError(rawError, null, form)
        },
        onBoth: () => {
          props.setLoading(false)
          _sendingOtp.current = false
        },
      })
    }).catch(() => null)
  }

  return (
    <Row wrap={false} gutter={[12, 0]}>
      <DialogEmailConfirm
        visible={visibleDialogConfirm}
        resEnrollEmail={props.resEnrollEmail}
        onClose={(resOtpEmail) => {
          setVisibleDialogConfirm(false)
          props.setResOtpEmail(resOtpEmail)
        }}
      />

      <Col flex="auto">
        <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input
            autoFocus
            disabled={isDisabled()}
            autoComplete="off"
            placeholder="my.name@idval.id"
            addonBefore={<MailOutlined />}
            addonAfter={props.resOtpEmail && <CheckOutlined style={{ color: '#2ecc71' }} />}
            onPressEnter={sendOtp}
          />
        </Form.Item>
      </Col>
      <Col flex="none">
        {isDisabled() ? (
          <Popconfirm
            placement="bottomRight"
            title="Warning Change Email"
            description="Are you sure you want to repeat the email validation process?"
            okText="Continue"
            okType="danger"
            okButtonProps={{ type: 'primary' }}
            onConfirm={props.reset}
          >
            <Button danger type="primary" icon={<EditOutlined />} />
          </Popconfirm>
        ) : (
          <Button type="primary" onClick={sendOtp}>
            Authenticate
          </Button>
        )}
      </Col>
    </Row>
  )
}