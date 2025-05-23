import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import { Button, Col, Form, Input, Popconfirm, Row } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import { ctx } from 'src/components';
import { lib, request } from 'src/utils';

import type { RefTypes } from './types';
import * as types from 'src/constants/types';

type PropTypes = {
  generateState: () => string;
  onSubmit: () => void;
  setLoading: (loading: boolean) => void;
  setResEnrollEmail: (resEnrollEmail: types.ENROLL_CHANGE_EMAIL) => void;
}

function StepInputEmail(props: PropTypes, ref: Ref<RefTypes>) {
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
          method: 'post',
          urlKey: 'auth-forget-password',
          headers,
          data: { email: values.email, state: props.generateState() },
          onSuccess: (res) => {
            props.setResEnrollEmail(res)
            resolve(true)
          },
          onFailed: (error, _, rawError) => {
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
      <div>
        <Row justify="center">
          <MailOutlined
            className="c-primary"
            style={{ fontSize: '72px' }}
          />
        </Row>
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '18px', fontWeight: 500, textAlign: 'center' }}>
              Input Your Email
            </div>
            <div style={{ textAlign: 'center' }}>
              You will receive an email containing OTP and confirm it in the next step.
            </div>
          </div>
          <div>
            <Form form={form} layout="vertical">
              <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
                <Input
                  autoFocus
                  placeholder="my.name@idval.id"
                  onPressEnter={props.onSubmit}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(StepInputEmail)