import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { App, Button, Col, Popconfirm, Row, Spin } from 'antd';
import { EditOutlined, PlusOutlined, SafetyCertificateTwoTone, SwitcherOutlined } from '@ant-design/icons';

import SettingTwoFactorPasskeyDevices from './PasskeyDevices';
import { cards, ctx, PageError } from 'src/components';
import { lib } from 'src/utils';

export default function SettingTwoFactorPasskey() {
  const { checkIsAuthorized, readSummary, twoFactorSummary } = ctx.tfa.useTwoFactorContext()
  const { notifError } = ctx.useNotif()

  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)

  const readTwoFactorSummary = () => {
    setLoading(true)

    readSummary()
      .then(() => setRawError(null))
      .catch(({ rawError }) => setRawError(rawError))
      .finally(() => setLoading(false))
  }

  const createPasskey = () => {
    checkIsAuthorized(true).then(isAuthorized => {
      if (!isAuthorized) return

      setLoading(true)

      lib.passkey.register()
        .then(readTwoFactorSummary)
        .catch((error) => notifError(error))
        .finally(() => setLoading(false))
    })
  }

  useEffect(readTwoFactorSummary, [])

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '24px' }}>
        {!rawError && (
          <div>
            <cards.List cardProps={{ style: {marginTop: 0} }}>
              <div style={{ padding: '12px' }}>
                <Row justify="space-between">
                  <Col>
                  </Col>
                  <Col>
                    <Row gutter={[12, 0]}>
                      <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={createPasskey}>
                          Create a Passkey
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </cards.List>
            {twoFactorSummary.passkey && (
              <SettingTwoFactorPasskeyDevices
                setLoading={setLoading}
              />
            )}
          </div>
        )}
        {rawError && (
          <cards.List cardProps={{ style: {marginTop: 0} }}>
            <PageError
              rawError={rawError}
              onReload={readTwoFactorSummary}
            />
          </cards.List>
        )}
      </div>
    </Spin>
  )
}