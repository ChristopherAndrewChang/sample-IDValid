import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form, Input } from 'antd';

import { lib, request } from 'src/utils';

import type { RefTypes } from './types';
import { ctx } from 'src/components';

function ConfirmEmail(props, ref: React.Ref<RefTypes>) {
  const _form = useRef(null)

  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()

  const submit = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      _form.current.validateFields().then(values => {
        checkIsAuthorized(true).then(isAuthorized => {
          if (!isAuthorized)
            return reject()

          props.setLoading(true)

          const { headers, encValues } = lib.getEncryptedData([values.password])
          request({
            method: 'post',
            urlKey: 'auth-user-change-email-detail',
            args: [props.resInputEmail?.id],
            headers,
            params: { ref_id: props.resInputEmail?.ref_id },
            data: {
              state: props.state,
              otp_id: props.resOtpEmail?.id,
              otp_token: props.resOtpEmail?.token,
              password: encValues[0],
            },
            onSuccess: () => {
              resolve(true)
            },
            onFailed: reject,
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
          Password Confirmation
        </div>
        <div>
          Input your password to apply your new email.
        </div>
      </div>
      <div>
        <Form ref={_form} layout="vertical">
          <Form.Item
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password
              autoFocus
              style={{ width: '100%' }}
              onPressEnter={props.onSubmit}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default forwardRef(ConfirmEmail)