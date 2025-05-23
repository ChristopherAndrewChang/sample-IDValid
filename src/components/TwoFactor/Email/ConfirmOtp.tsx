import { useRef } from 'react';
import { Form, Input } from 'antd';

import { lib, request } from 'src/utils';

type PropTypes = {
  setLoading: (loading: boolean) => void;
  onVerified: (token) => void;
}

export default function TwoFactorEmailConfirmOtp(props: PropTypes) {
  const _form = useRef<any>(null)

  const verifyPin = (otp: string) => {
    props.setLoading(true)

    const { headers } = lib.getEncryptedData()
    request({
      method: 'post',
      urlKey: 'auth-multi-factors-email',
      headers,
      data: { pin: otp },
      onSuccess(responseData, extra, response) {
        props.onVerified(responseData)
      },
      onFailed(responseData, extra, response) {
        // if (_form.current)
        _form.current.resetFields()
      },
      onBoth() {
        props.setLoading(false)
      },
    })
  }

  return (
    <div>
      <div style={{ marginTop: '12px' }}>
        <Form ref={_form} layout="vertical">
          <Form.Item name="pin" getValueFromEvent={(value) => verifyPin(value)} style={{ marginBottom: 0 }}>
            <Input.OTP autoFocus style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}