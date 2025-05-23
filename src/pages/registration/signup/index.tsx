import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { App, Button, Card, Col, Form, Input, Row, Spin } from 'antd';

import { ctx } from 'src/components';
import FieldEmail from './Email';
import { lib, request } from 'src/utils';
import appConfig from 'src/config/app';
import ct from 'src/constants';

import type * as types from 'src/constants/types';
import { ArrowLeftOutlined, BackwardOutlined, LeftOutlined } from '@ant-design/icons';

export default function Signup() {
  const { notification, notifError } = ctx.useNotif()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState('')
  const [resEnrollEmail, setResEnrollEmail] = useState<types.ENROLL_INPUT_EMAIL>(null)
  const [resOtpEmail, setResOtpEmail] = useState<types.ENROLL_OTP_EMAIL>(null)
  // testing
  // const [resEnrollEmail, setResEnrollEmail] = useState<types.ENROLL_INPUT_EMAIL>({"id": "UloR2hahG4XVnLeCIRTcLr_7qWTuQytb9GCNPSAW9_M-blVNpCBxxaE6w2a4TeXm","email_id": "ign0X-8YSfVLjsO7jNfvs7m_4KFCOrPTZt60fVXqM1_w-Y-FEM9SHt-hx_fM6v9x"})
  // const [resOtpEmail, setResOtpEmail] = useState<types.ENROLL_OTP_EMAIL | any>({"id": "4hOe2LY5ZFdmW14TsiwskBilTZOlnqDbiOv35nMBiIH1SvxqqUS_vo6qP_uFiXpF","token": "gnvWd1yTRIqyvAv98ARizNcQZKItCsWLviUGH5yfn9BZHx6-WmP3gCfaDYRVxepj"})

  const generateState = () => {
    const state = lib.generateState()
    setState(state)
    return state
  }

  const createAccount = () => {
    if (loading) return

    form.validateFields().then((values) => {
      setLoading(true)

      const { headers } = lib.getEncryptedData()
      request({
        usingSession: false,
        method: 'post',
        urlKey: 'auth-user-register',
        args: [resEnrollEmail.id],
        headers,
        data: {
          username: values.username,
          name: values.name,
          password: values.password,
          state,
          otp_id: resOtpEmail.id,
          otp_token: resOtpEmail.token,
        },
        onSuccess: () => {
          notification.success({ message: 'Congratulations', description: 'Your account has been successfully created.' })

          setTimeout(() => navigate(ct.paths.PUBLIC_SIGNIN), 1000)
        },
        onFailed: (error, _, rawError) => {
          setLoading(false)
          notifError(rawError, null, form)

          // mapping :
          // 403 -> {"detail":"Token expired."} -> Suruh verifikasi ulang emailnya
        },
        // onBoth: () => setLoading(false),
      })
    }).catch(() => null)
  }

  return (
    <Row justify="center" style={{ height: '100%' }}>
      <Col>
        <Spin spinning={loading}>
          <Card
            className="card-hovered"
            style={{ margin: '48px 24px', width: '520px', maxWidth: 'calc(100% - 24px - 24px)' }}
            // title="Create a IDValid Account"
            title={(
              <Row align="middle" wrap={false} gutter={[12, 12]}>
                <Col>
                  <Button
                    type="text"
                    shape="circle"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                  />
                </Col>
                <Col style={{ fontSize: '16px' }}>
                  Create a IDValid Account
                </Col>
              </Row>
            )}
          >
            <Row wrap={false} gutter={[48, 48]}>
              <Col flex="auto">
                <Form form={form} layout="vertical">
                  <FieldEmail
                    resEnrollEmail={resEnrollEmail}
                    resOtpEmail={resOtpEmail}
                    setLoading={setLoading}
                    generateState={generateState}
                    setResEnrollEmail={setResEnrollEmail}
                    setResOtpEmail={setResOtpEmail}
                    reset={() => {
                      setResEnrollEmail(null)
                      setResOtpEmail(null)
                    }}
                  />
                  
                  {resOtpEmail && (
                    <div>
                      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                        <Input
                          autoFocus
                          autoCapitalize="off"
                          onPressEnter={createAccount}
                        />
                      </Form.Item>
                      <Form.Item name="name" label="Your Name" rules={[{ required: true }]}>
                        <Input
                          autoCapitalize="words"
                          onPressEnter={createAccount}
                        />
                      </Form.Item>
                      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password
                          autoCapitalize="off"
                          onPressEnter={createAccount}
                        />
                      </Form.Item>
                      <Form.Item
                        name="verify_password"
                        label="Verify Password"
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              return getFieldValue('password') === getFieldValue('verify_password')
                                ? Promise.resolve()
                                : Promise.reject(new Error('Those passwords didn\'t match. Try again.'))
                            }
                          })
                        ]}
                      >
                        <Input.Password
                          autoCapitalize="off"
                          onPressEnter={createAccount}
                        />
                      </Form.Item>
                    </div>
                  )}
                </Form>
              </Col>
            </Row>
            {resOtpEmail && (
              <Row justify="space-between">
                <Col flex="auto">
                  <Button
                    block
                    type="primary"
                    size="large"
                    shape="round"
                    // icon={<SaveOutlined />}
                    onClick={createAccount}
                  >
                    Create Account
                  </Button>
                </Col>
              </Row>
            )}
          </Card>
        </Spin>
      </Col>
    </Row>
  )
}