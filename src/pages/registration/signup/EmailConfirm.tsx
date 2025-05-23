import { useState } from 'react';
import { App, Form, Input, Modal, Spin } from 'antd';

import { ctx } from 'src/components';
import { request } from 'src/utils';

import type * as types from 'src/constants/types';
import { MailOutlined } from '@ant-design/icons';

type PropTypes = {
  visible: boolean;
  resEnrollEmail: types.ENROLL_INPUT_EMAIL;
  onClose: (resOtpEmail: types.ENROLL_OTP_EMAIL) => void;
}

export default function DialogEmailConfirm(props: PropTypes) {
  const { modal } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { notifError } = ctx.useNotif()

  const verify = (pin: string) => {
    setLoading(true)

    request({
      usingSession: false,
      method: 'post',
      urlKey: 'otp-apply',
      args: ['email-enrollment', props.resEnrollEmail?.id],
      params: { ref_id: props.resEnrollEmail?.email_id },
      data: { pin },
      onSuccess: props.onClose,
      onFailed: (error, _, rawError) => {
        form.resetFields()
        notifError(rawError, null, form)
      },
      onBoth: () => setLoading(false),
    })
  }

  const onClose = () => {
    modal.confirm({
      title: 'Close Verify OTP Email',
      content: (
        <div>
          Are you sure want to cancel verify OTP Email?
        </div>
      ),
      onOk: () => props.onClose(null),
    })
  }

  return (
    <Modal
      // open
      open={props.visible}
      maskClosable={false}
      footer={null}
      title="Verify Email"
      onCancel={onClose}
    >
      <Spin spinning={loading}>
        <div style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div>
              <MailOutlined
                style={{ fontSize: '48px' }}
              />
            </div>
            <div style={{ marginTop: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 500 }}>
                Verify Email
              </div>
              <div>
                {/* A code has been emailed to you. */}
                Enter the code that has been sent to your email.
              </div>
            </div>
          </div>
          <div>
            <Form form={form} layout="vertical">
              <Form.Item name="pin" getValueFromEvent={verify}>
                <Input.OTP
                  autoFocus
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}