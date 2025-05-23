import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import { Button, Col, Form, Input, Popconfirm, Row } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import { ctx } from 'src/components';
import { lib, request } from 'src/utils';

import type { RefTypes } from './types';
import * as types from 'src/constants/types';

type PropTypes = {
  resEnrollEmail: types.ENROLL_CHANGE_EMAIL;
  onSubmit: () => void;
  setLoading: (loading: boolean) => void;
  setResOtpEmail: (resOtpEmail: types.ENROLL_OTP_EMAIL) => void;
}

function StepOtpEmail(props: PropTypes, ref: Ref<RefTypes>) {
  const _loading = useRef(false)
  const [form] = Form.useForm()

  const { notifError } = ctx.useNotif()

  const submit = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      form.validateFields().then((values) => {
        _loading.current = true
        props.setLoading(true)

        // const { headers } = lib.getEncryptedData()
        request({
          usingSession: false,
          method: 'post',
          urlKey: 'otp-apply',
          args: ['forget-password', props.resEnrollEmail.id],
          params: { ref_id: props.resEnrollEmail.ref_id },
          data: { pin: values.pin },
          onSuccess: (res) => {
            props.setResOtpEmail(res)
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
        <div style={{ fontSize: '18px', fontWeight: 500 }}>
          Verify Email
        </div>
        <div>
          A code has been emailed to you.
        </div>
      </div>
      <div>
        <Form form={form} layout="vertical">
          <Form.Item
            name="pin"
            getValueFromEvent={(val) => {
              props.onSubmit()
              return val
            }}
          >
            <Input.OTP
              autoFocus
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default forwardRef(StepOtpEmail)