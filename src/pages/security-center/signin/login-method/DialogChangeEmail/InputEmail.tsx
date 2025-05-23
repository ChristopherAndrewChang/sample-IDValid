import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import { ctx } from 'src/components';
import { lib, request } from 'src/utils';

import type { RefTypes } from './types';

type PropTypes = {
  setLoading: (loading: boolean) => void;
  setState: (state: string) => void;
  onSubmit: () => void;
  setResInputEmail: (res) => void;
}

function InputEmail(props: PropTypes, ref: React.Ref<RefTypes>) {
  const _form = useRef(null)
  const _input = useRef(null)

  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()

  // const validate = async () => _form.current.validateFields()

  const submit = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      _form.current.validateFields().then(values => {
        checkIsAuthorized(true).then(isAuthorized => {
          if (!isAuthorized)
            return reject()

          const state = lib.generateState()

          props.setLoading(true)
          props.setState(state)

          const { headers } = lib.getEncryptedData()
          request({
            method: 'post',
            urlKey: 'auth-user-change-email',
            headers,
            data: { email: values.email, state },
            onSuccess: (res) => {
              props.setResInputEmail(res)
              resolve(res)
            },
            onFailed: (error, _, rawError) => {
              reject(rawError)
            },
            // onFailed: () => resolve(true),
            onBoth: () => props.setLoading(false),
          })
        })
      }).catch(reject)
    })
  }

  useImperativeHandle(ref, () => ({ submit }))

  useEffect(() => {
    setTimeout(_input.current.focus, 500)
  }, [])

  console.log('Rendered InputEmail _form', _form)

  return (
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
            Input New Email
          </div>
          <div style={{ textAlign: 'center' }}>
            You will receive an email containing OTP and confirm it in the next step.
          </div>
        </div>
        <div>
          <Form ref={_form} layout="vertical">
            <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
              <Input
                ref={_input}
                autoFocus
                placeholder="example@email.com"
                onPressEnter={props.onSubmit}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(InputEmail)