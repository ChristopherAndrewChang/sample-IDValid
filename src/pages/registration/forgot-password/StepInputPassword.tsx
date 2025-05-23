import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import { Alert, Button, Col, Form, Input, Popconfirm, Row } from 'antd';
import { MailOutlined, WarningOutlined } from '@ant-design/icons';

import { ctx } from 'src/components';
import { lib, request } from 'src/utils';

import type { RefTypes } from './types';
import * as types from 'src/constants/types';

type PropTypes = {
  state: string;
  resEnrollEmail: types.ENROLL_CHANGE_EMAIL;
  resOtpEmail: types.ENROLL_OTP_EMAIL;
  onSubmit: () => void;
  setLoading: (loading: boolean) => void;
}

function StepInputNewPassword(props: PropTypes, ref: Ref<RefTypes>) {
  const _loading = useRef(false)
  const [form] = Form.useForm()

  const { notifError } = ctx.useNotif()

  const submit = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      form.validateFields().then((values) => {
        _loading.current = true
        props.setLoading(true)

        const { headers } = lib.getEncryptedData()
        request({
          usingSession: false,
          method: 'post',
          urlKey: 'auth-forget-password-detail',
          args: [props.resEnrollEmail.id],
          headers,
          data: {
            state: props.state,
            otp_id: props.resOtpEmail.id,
            otp_token: props.resOtpEmail.token,
            password: values.password,
          },
          onSuccess: (res) => {
            resolve(true)
          },
          onFailed: (error, _, rawError) => {
            form.resetFields()
            notifError(rawError, null, form)
            reject(rawError)
          },
          onBoth: () => {
            props.setLoading(false)
            _loading.current = false
          },
        })
      }).catch(reject)
    })
  }

  useImperativeHandle(ref, () => ({ submit }))

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>
          Set a new password
        </div>
        <div>
          {/* <WarningOutlined style={{ marginRight: '4px' }} /> */}
          Use a password that is difficult for others to guess.
        </div>
      </div>
      <div>
        <Form form={form} layout="vertical">
          <Form.Item
            name="password"
            label="New Password"
            extra="Create a password that is easy for you to remember but hard for others to guess. Make sure it includes lowercase letters, uppercase letters, numbers, and special characters."
            rules={[{ required: true }]}
          >
            <Input.Password
              autoFocus
              style={{ width: '100%' }}
              onPressEnter={props.onSubmit}
            />
          </Form.Item>
          <Form.Item
            name="verify_password"
            label="Verify New Password"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return getFieldValue('password') === getFieldValue('verify_password')
                    ? Promise.resolve()
                    : Promise.reject(new Error('Those passwords didn\'t match. Try again.'))
                }
              }),
            ]}
          >
            <Input.Password
              autoCapitalize="off"
              onPressEnter={props.onSubmit}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default forwardRef(StepInputNewPassword)