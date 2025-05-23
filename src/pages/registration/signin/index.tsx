import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { App, Button, Card, Col, Form, Input, Row, Spin } from 'antd';

import { lib, request } from 'src/utils';
import ct from 'src/constants';

export default function Signin() {
  const { notification } = App.useApp()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  // const location = useLocation()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  const objSearchParams = lib.getObjSearchParams(searchParams)

  console.log('searchParams', {searchParams, location, objSearchParams}, lib.getObjSearchParams(searchParams))

  const getFormValues = async () => {
    return await form.validateFields().catch(() => null)
  }

  const signIn = async () => {
    console.log('signIn form', form)

    const values = await getFormValues()
    if (!values)
      return

    console.log('form values', values)

    setLoading(true)

    const isValidEmail = lib.validate.email(values.username) // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.username)
    const { headers, encValues } = lib.getEncryptedData([values.password])

    request({
      method: 'post',
      urlKey: isValidEmail ? 'auth-login-email' : 'auth-login',
      usingSession: false,
      headers,
      data: {
        ...(isValidEmail ? {email: values.username} : {username: values.username}),
        password: encValues[0],
      },
      onSuccess: signInSuccess,
      onFailed: (error) => {
        setLoading(false)

        console.log('onFailed', error)
        console.log('next', objSearchParams.next)

        notification.error({ message: 'Failed to sign in' })
      },
    })
  }

  const signInSuccess = async (token) => {
    console.log('signInSuccess', token)


    lib.ls.setUserToken(token)

    if (objSearchParams.next)
      navigate(decodeURIComponent(objSearchParams.next))
    else
      navigate(ct.paths.MAIN)
  }

  return (
    <Row justify="center" align="middle" style={{ height: '100%' }}>
      <Col>
        <Spin spinning={loading}>
          <Card className="card-hovered" title="Sign in with IDValid" style={{ margin: '24px', width: '1040px', maxWidth: 'calc(100% - 24px - 24px)' }}>
            <Row wrap={false} gutter={[48, 48]} style={{ marginBottom: '48px' }}>
              <Col flex="1 1 50%">
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>
                  Sign in
                </div>
                {/* <div style={{ fontSize: '1rem' }}>
                  to continue to IBES
                </div> */}
              </Col>
              <Col flex="1 1 50%">
                <Form form={form} layout="vertical">
                  <Form.Item name="username" label="Username / Email" rules={[{ required: true }]}>
                    <Input autoFocus />
                  </Form.Item>
                  <Form.Item name="password" label="Password" rules={[{ required: true }]} style={{ marginBottom: '12px' }}>
                    <Input.Password autoComplete="new-password" onPressEnter={signIn} />
                  </Form.Item>
                </Form>
                <Row justify="end">
                  <Button type="link" size="small" style={{ fontWeight: 500 }} onClick={() => navigate(ct.paths.PUBLIC_FORGOTPASSWORD)}>
                    Forgot Password?
                  </Button>
                </Row>
                {/* <div style={{ marginBottom: '24px' }}>
                  By continuing, IDValid will share your name, email address, language preference, and profile picture with IBES. See IBES Privacy Policy and Terms of Service.
                </div>
                <div>
                  You can manage Sign in with IDValid in your IDValid Account.
                </div> */}
              </Col>
            </Row>
            <Row justify="space-between">
              <Col flex="1 1 50%" style={{ paddingRight: '24px' }}>
                {/* <Button size="large" shape="round" icon={<UserSwitchOutlined />} onClick={switchUser}>
                  Use another account
                </Button> */}
              </Col>
              <Col flex="1 1 50%" style={{ paddingLeft: '24px' }}>
                <Row gutter={[12, 12]}>
                  <Col flex="auto">
                    <Button block size="large" shape="round" onClick={() => navigate(ct.paths.PUBLIC_SIGNUP)}>
                      Create account
                    </Button>
                  </Col>
                  <Col flex="auto">
                    <Button block type="primary" size="large" shape="round" onClick={signIn}>
                      Next
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Col>
    </Row>
  )
}