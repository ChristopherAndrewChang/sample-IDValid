import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { App, Button, Card, Col, Form, Input, Popconfirm, Row, Spin, Steps } from 'antd';

import StepInputEmail from './StepInputEmail';
import StepOtpEmail from './StepOtpEmail';
import StepInputNewPassword from './StepInputPassword';
import { ctx, VisibilityContainer } from 'src/components';
// import FieldEmail from './Email';
import { lib, request } from 'src/utils';
import appConfig from 'src/config/app';
import ct from 'src/constants';

import type * as types from 'src/constants/types';
import { ArrowLeftOutlined, BackwardOutlined, LeftOutlined, WarningOutlined } from '@ant-design/icons';

const KEY_INPUT_EMAIL = 'input-email'
const KEY_OTP_EMAIL = 'otp-email'
const KEY_INPUT_PASSWORD = 'input-new-password'

type StepTypes = {
  key: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  render: (item, i) => React.ReactNode;

  nextLabel?: React.ReactNode;
}

export default function ForgotPassword() {
  const { notification, notifError } = ctx.useNotif()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [state, setState] = useState('')
  const [resEnrollEmail, setResEnrollEmail] = useState<types.ENROLL_CHANGE_EMAIL>(null)
  const [resOtpEmail, setResOtpEmail] = useState<types.ENROLL_OTP_EMAIL>(null)
  // testing
  // const [resEnrollEmail, setResEnrollEmail] = useState<types.ENROLL_INPUT_EMAIL>({"id": "UloR2hahG4XVnLeCIRTcLr_7qWTuQytb9GCNPSAW9_M-blVNpCBxxaE6w2a4TeXm","email_id": "ign0X-8YSfVLjsO7jNfvs7m_4KFCOrPTZt60fVXqM1_w-Y-FEM9SHt-hx_fM6v9x"})
  // const [resOtpEmail, setResOtpEmail] = useState<types.ENROLL_OTP_EMAIL>({"id": "4hOe2LY5ZFdmW14TsiwskBilTZOlnqDbiOv35nMBiIH1SvxqqUS_vo6qP_uFiXpF","token": "gnvWd1yTRIqyvAv98ARizNcQZKItCsWLviUGH5yfn9BZHx6-WmP3gCfaDYRVxepj"})

  const activeSteps: StepTypes[] = [
    {
      key: KEY_INPUT_EMAIL,
      title: 'Input Email',
      description: 'Input New Email',
      nextLabel: 'Send a code',
      render: (_, i) => (
        <StepInputEmail
          ref={_refs[i]}
          generateState={generateState}
          onSubmit={nextStep}
          setLoading={setLoading}
          setResEnrollEmail={setResEnrollEmail}
        />
      ),
    },
    {
      key: KEY_OTP_EMAIL,
      title: 'Input OTP',
      description: 'Input OTP Email',
      render: (_, i) => (
        <StepOtpEmail
          ref={_refs[i]}
          resEnrollEmail={resEnrollEmail}
          onSubmit={nextStep}
          setLoading={setLoading}
          setResOtpEmail={setResOtpEmail}
          // resInputEmail={resInputEmail}
        />
      ),
    },
    {
      key: KEY_INPUT_PASSWORD,
      title: 'Set a Password',
      // description: (
      //   <span>
      //     <WarningOutlined style={{ marginRight: '4px' }} />
      //     Don't forget your password
      //   </span>
      // ),
      nextLabel: 'Save Password',
      render: (_, i) => (
        <StepInputNewPassword
          ref={_refs[i]}
          state={state}
          resEnrollEmail={resEnrollEmail}
          resOtpEmail={resOtpEmail}
          onSubmit={nextStep}
          setLoading={setLoading}
        />
      ),
    },
  ]

  const _refs = activeSteps.map(() => useRef(null))

  const generateState = () => {
    const state = lib.generateState()
    setState(state)
    return state
  }

  const validateStep = async (stepIndex = currentStepIndex) => {
    return new Promise(async (resolve, reject) => {
      let success = true
      let error = null

      if (typeof _refs[stepIndex]?.current?.submit === 'function')
        success = await _refs[stepIndex].current.submit().catch(e => {error = e})

      console.log('validateStep error', error)
      return success
        ? resolve(success)
        : reject()
    })
  }

  const nextStep = () => {
    validateStep()
      .then(() => {
        console.log('validateStep', currentStepIndex)
        if (currentStepIndex < activeSteps.length - 1)
          setCurrentStepIndex(currentStepIndex + 1)
        else {
          notification.success({ key: 'success-reset-password', message: 'Success Save New Password' })
          navigate(ct.paths.PUBLIC_SIGNIN)
        }
      })
      .catch((e) => {
        // notification.error({
        //   key: 'step-error',
        //   message: 'Failed to continue',
        //   description: 'Check the error message and fix it to continue.',
        // })
      })
  }

  return (
    <Row justify="center" style={{ height: '100%' }}>
      <Col>
        <Spin spinning={loading}>
          <Card
            className="card-hovered"
            style={{ margin: '24px', width: '1040px', maxWidth: 'calc(100% - 24px - 24px)' }}
            // title="Create a IDValid Account"
            title={(
              <Row align="middle" wrap={false} gutter={[12, 12]}>
                <Col>
                  <Popconfirm
                    placement="bottomLeft"
                    title="Are you sure want to cancel Forgot Password?"
                    okText="Yes"
                    onConfirm={() => navigate(-1)}
                  >
                    <Button
                      type="text"
                      shape="circle"
                      icon={<ArrowLeftOutlined />}
                    />
                  </Popconfirm>
                </Col>
                <Col style={{ fontSize: '16px' }}>
                  Forgot Password
                </Col>
              </Row>
            )}
          >
            <div style={{ marginBottom: '1rem' }}>
              <Steps responsive={false} className="change-email-steps" type="navigation" current={currentStepIndex}>
                {activeSteps.map(step => (
                  <Steps.Step
                    key={step.key}
                    title={step.title}
                    description={step.description}
                    // onClick={() => setCurrentStepIndex(activeSteps.indexOf(step))}
                  />
                ))}
              </Steps>
            </div>
            <div className="change-email-steps-content">
              {activeSteps.map((step, i) => (
                <VisibilityContainer key={step.key} destroyOnClose className={`test-${step.key}`} visible={currentStepIndex === i}>
                  {step.render(step, i)}
                </VisibilityContainer>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,.06)', paddingTop: '16px' }}>
              <Row justify="space-between" gutter={[6, 6]}>
                <Col>
                  {/* <Row gutter={[6, 6]}>
                    <Col>
                      <Popconfirm title="Exiting the dialog will repeat from the beginning step.">
                        <Button>
                          Cancel
                        </Button>
                      </Popconfirm>
                    </Col>
                  </Row> */}
                </Col>
                <Col>
                  <Row justify="end" gutter={[6, 6]}>
                    {currentStepIndex < activeSteps.length && activeSteps[currentStepIndex].nextLabel && (
                      <Col>
                        <Button disabled={loading} type="primary" onClick={nextStep}>
                          {activeSteps[currentStepIndex].nextLabel}
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
          </Card>
        </Spin>
      </Col>
    </Row>
  )
}