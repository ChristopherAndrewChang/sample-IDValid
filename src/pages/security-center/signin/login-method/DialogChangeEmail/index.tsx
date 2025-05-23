import React, { useRef, useState } from 'react';
import { App, Button, Col, Modal, Popconfirm, Row, Spin, Steps } from 'antd';
import InputEmail from './InputEmail';
import OTPEmail from './OTPEmail';
import ConfirmEmail from './Confirm';
import { VisibilityContainer } from 'src/components';
import { SaveOutlined } from '@ant-design/icons';
import Countdown from 'src/components/Countdown';
import ButtonCountdown from 'src/components/ButtonCountdown';

const KEY_INPUT_EMAIL = 'input-email'
const KEY_OTP_EMAIL = 'otp-email'
const KEY_CONFIRM_EMAIL = 'confirm-email'

type PropTypes = {
  onClose: () => void;

  visible?: boolean;
}

type StepTypes = {
  key: string;
  title: string;
  description: string;
  render: (item, i) => React.ReactNode;

  nextLabel?: React.ReactNode;
  prevWait?: number;
}

export default function DialogChangeEmail({
  onClose,
  visible = false,
}: PropTypes) {
  const { notification } = App.useApp()

  const [loading, setLoading] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [state, setState] = useState<string>(null)
  const [resInputEmail, setResInputEmail] = useState(null)
  const [resOtpEmail, setResOtpEmail] = useState(null)

  const activeSteps: StepTypes[] = [
    {
      key: KEY_INPUT_EMAIL,
      title: 'Input Email',
      description: 'Input New Email',
      nextLabel: 'Send a code',
      render: (_, i) => (
        <InputEmail
          ref={_refs[i]}
          setState={setState}
          setLoading={setLoading}
          onSubmit={nextStep}
          setResInputEmail={setResInputEmail}
        />
      ),
    },
    {
      key: KEY_OTP_EMAIL,
      title: 'Input OTP',
      description: 'Input OTP Email',
      // prevWait: 5 * 60 * 1000, // saya ingin ini hanya aktif ketika dari step 1 -> step 2 (next), bukan dari step 3 -> step 2 (previous), bagaimana?
      nextLabel: null,
      render: (_, i) => (
        <OTPEmail
          ref={_refs[i]}
          resInputEmail={resInputEmail}
          setLoading={setLoading}
          onSubmit={nextStep}
          setResOtpEmail={setResOtpEmail}
        />
      ),
    },
    {
      key: KEY_CONFIRM_EMAIL,
      title: 'Confirm',
      description: 'Confirm your Email',
      nextLabel: 'Confirm',
      render: (_, i) => (
        <ConfirmEmail
          ref={_refs[i]}
          state={state}
          resInputEmail={resInputEmail}
          resOtpEmail={resOtpEmail}
          setLoading={setLoading}
          onSubmit={nextStep}
        />
      ),
    },
  ]

  const _refs = activeSteps.map(() => useRef(null)) // [useRef(null), useRef(null), useRef(null)]

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
          notification.success({ key: 'success-change-email', message: 'Email Changed' })
          onClose()
        }
      })
      .catch((e) => notification.error({ key: 'step-error', message: 'Failed to continue', description: 'Check the error message and fix it to continue.' }))
  }

  console.log('Rendered refs', _refs)
  console.log('Rendered countdown prev', activeSteps[currentStepIndex].prevWait)

  const renderFooter = () => (
    <div style={{ borderTop: '1px solid rgba(0,0,0,.06)', padding: '16px' }}>
      <Row justify="space-between" gutter={[6, 6]}>
        <Col>
          <Row gutter={[6, 6]}>
            <Col>
              <Popconfirm title="Exiting the dialog will repeat from the beginning step." onConfirm={onClose}>
                <Button>
                  Cancel
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row justify="end" gutter={[6, 6]}>
            {/* {currentStepIndex > 0 && (
              <Col>
                <Popconfirm title="Are you sure?">
                  <ButtonCountdown disabledDuration={activeSteps[currentStepIndex].prevWait} onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                    Previous
                  </ButtonCountdown>
                </Popconfirm>
              </Col>
            )} */}
            {currentStepIndex < activeSteps.length && activeSteps[currentStepIndex].nextLabel && (
              <Col>
                <Button disabled={loading} type="primary" onClick={nextStep}>
                  {/* Next */}
                  {activeSteps[currentStepIndex].nextLabel}
                </Button>
              </Col>
            )}
            {/* {currentStepIndex === activeSteps.length - 1 && (
              <Col>
                <Button type="primary" icon={<SaveOutlined />}>
                  Confirm
                </Button>
              </Col>
            )} */}
          </Row>
        </Col>
      </Row>
    </div>
  )

  return (
    <Modal
      destroyOnClose
      open={visible}
      closable={false}
      width={720}
      style={{ top: 48 }}
      styles={{ content: {padding: 0}, footer: {marginTop: 0} }}
      footer={renderFooter()}
      afterClose={() => setCurrentStepIndex(0)}
    >
      <div style={{ padding: '16px' }}>
        <Spin spinning={loading}>
          <div style={{ marginBottom: '1rem' }}>
            <Steps className="change-email-steps" type="navigation" current={currentStepIndex}>
              {activeSteps.map(step => (
                <Steps.Step
                  key={step.key}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </Steps>
          </div>
          <div className="change-email-steps-content">
            {activeSteps.map((step, i) => (
              <VisibilityContainer key={step.key} className={`test-${step.key}`} visible={currentStepIndex === i}>
                {step.render(step, i)}
              </VisibilityContainer>
            ))}
          </div>
        </Spin>
      </div>
    </Modal>
  )
}