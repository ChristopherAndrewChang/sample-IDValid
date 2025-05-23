import { useNavigate } from 'react-router';
import { useRef, useState } from 'react';
import { App, Button, Form, Input, Spin } from 'antd';

import { cards, ctx } from 'src/components';
import { lib, request } from 'src/utils';


export default function ChangePassword() {
  const _form = useRef(null)
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()
  const { notifError } = ctx.useNotif()

  const [loading, setLoading] = useState(false)

  const savePassword = () => {
    _form.current.validateFields().then(values => {
      checkIsAuthorized(true).then(isAuthorized => {
        if (isAuthorized) {
          setLoading(true)

          const { headers, encValues } = lib.getEncryptedData([values.old_password, values.new_password])
          request({
            method: 'post',
            urlKey: 'auth-user-password',
            headers,
            data: {
              old_password: encValues[0],
              new_password: encValues[1],
            },
            onSuccess: () => {
              notification.success({ key: 'password-saved', message: 'Success', description: 'Successfully saved new password' })
              navigate(-1)
            },
            onFailed: (error, _, rawError) => {
              notifError(rawError, null, _form.current)
              console.log({ error, rawError })
            },
            onBoth: () => setLoading(false),
          })
        }
      })
    }).catch(() => null)
  }

  console.log('Rendered ChangePassword _form', _form)

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '12px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ maxWidth: '840px' }}>
            <cards.List title="Change Password">
              <div style={{ padding: '24px' }}>
                <div>
                  <Form ref={_form} layout="vertical">
                    <Form.Item name="old_password" label="Current Password" rules={[{ required: true }]}>
                      <Input.Password autoFocus onPressEnter={savePassword} />
                    </Form.Item>
                    <Form.Item name="new_password" label="Password" rules={[{ required: true }]}>
                      <Input.Password onPressEnter={savePassword} />
                    </Form.Item>
                    <Form.Item
                      name="verify_password"
                      label="Verify New Password"
                      rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            return getFieldValue('new_password') === getFieldValue('verify_password')
                              ? Promise.resolve()
                              : Promise.reject(new Error('Verify password do not match'))
                          }
                        }),
                      ]}
                    >
                      <Input.Password
                        autoCapitalize="off"
                        onPressEnter={savePassword}
                      />
                    </Form.Item>
                  </Form>
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <Button block type="primary" onClick={savePassword}>
                    Save
                  </Button>
                </div>
              </div>
            </cards.List>
          </div>
        </div>
      </div>
    </Spin>
  )
}