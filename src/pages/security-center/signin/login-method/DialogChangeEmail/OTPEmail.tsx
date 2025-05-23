import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form, Input } from 'antd';

import { request } from 'src/utils';

import type { RefTypes } from './types';
import { ctx } from 'src/components';

type PropTypes = {
  // resInputEmail: any;
}

function OTPEmail(props, ref: React.Ref<RefTypes>) {
  const _form = useRef(null)

  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()

  const submit = async (): Promise<boolean> => {
    console.log('submit OTPEmail props', props)
    return new Promise((resolve, reject) => {
      _form.current.validateFields().then(values => {
        checkIsAuthorized(true).then(isAuthorized => {
          if (!isAuthorized)
            return reject()

          props.setLoading(true)

          request({
            method: 'post',
            urlKey: 'otp-apply',
            args: ['change-email', props.resInputEmail?.id],
            params: { ref_id: props.resInputEmail?.ref_id },
            data: { pin: values.otp },
            onSuccess: (res) => {
              props.setResOtpEmail(res)
              resolve(res)
            },
            onFailed: (error, _, rawError) => {
              _form.current.resetFields()
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
        <Form ref={_form} layout="vertical">
          <Form.Item
            name="otp"
            // rules={[{ required: true }]}
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

export default forwardRef(OTPEmail)