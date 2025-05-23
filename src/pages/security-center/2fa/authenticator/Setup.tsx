import { useEffect, useRef, useState } from 'react';
import { App, Form, Input, Modal, Row, Spin } from 'antd';
import { QRCodeSVG } from 'qrcode.react';

import { ctx, PageError } from 'src/components';
import { lib, request } from 'src/utils';

export default function DialogSettingTwoFactorAuthenticatorSetup({
  visible = true,
  onClose,
}) {
  const _form = useRef<any>(null)
  const { message, notification } = App.useApp()
  const { isAuthorized, checkIsAuthorized, validateError } = ctx.tfa.useTwoFactorContext()

  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [visibleInput, setVisibleInput] = useState(false)
  const [qrCode, setQrCode] = useState(null)

  const readBarcode = () => {
    setLoading(true)

    request({
      checkIsAuthorized,
      deniedCallback: () => onClose(false),
      onBefore: (options) => {
        const { headers } = lib.getEncryptedData()
        options.headers = { ...options.headers, ...headers }
      },
      urlKey: 'auth-security-authenticator',
      onSuccess: (res) => {
        setRawError(null)
        setQrCode(res)
      },
      onFailed: (error, _, rawError) => setRawError(rawError),
      onBoth: () => setLoading(false),
    })
  }

  const verifyFailed = () => {
    notification.error({ message: 'Failed', description: 'Code failed to verify, please recheck your code.' })
    _form.current.resetFields()
  }

  const verifyCode = (code: string) => {
    if (loading) return

    setLoading(true)
    request({
      checkIsAuthorized,
      deniedCallback: verifyFailed,
      onBefore: (options) => {
        const { headers } = lib.getEncryptedData()
        options.headers = { ...options.headers, ...headers }
      },
      method: 'put',
      urlKey: 'auth-security-authenticator-detail',
      args: [qrCode?.pk],
      data: { code },
      onSuccess: (res) => {
        notification.success({ message: 'Success', description: 'Time-based One Time Password (TOTP) active' })
        onClose(true)
      },
      onFailed: verifyFailed,
      onBoth: () => setLoading(false),
    })
  }

  useEffect(() => visible && readBarcode(), [visible])

  return (
    <Modal
      open={visible}
      title="Configure Authenticator"
      footer={null}
      afterOpenChange={setVisibleInput}
      onCancel={() => {
        if (loading)
          return message.info('You can close this dialog once the process is complete.')

        onClose()
      }}
    >
      <Spin spinning={loading}>
        {rawError ? (
          <PageError
            rawError={rawError}
            onReload={readBarcode}
          />
        ) : qrCode && (
          <div style={{ padding: '12px' }}>
            <div style={{ margin: '12px' }}>
              <div style={{ marginTop: '12px' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontWeight: 500 }}>
                  Open authenticator (
                  <b>Google Authenticator </b>
                  or
                  <b> Microsoft Authenticator</b>
                  ) and choose scan barcode.
                </div>
              </div>
              <Row justify="center" style={{ marginTop: '12px' }}>
                <QRCodeSVG
                  size={192}
                  value={qrCode?.url}
                />
              </Row>
              <div style={{ marginTop: '12px' }}>
                <Form ref={_form} layout="vertical">
                  {visibleInput && (
                    <div>
                      <div style={{ marginTop: '12px' }}>
                        <Form.Item name="code" style={{ marginBottom: 0 }} getValueFromEvent={verifyCode}>
                          <Input.OTP
                            autoFocus
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  )}
                </Form>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', fontWeight: 500 }}>
                  After scanning the barcode above, enter the code
                </div>
              </div>
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  )
}