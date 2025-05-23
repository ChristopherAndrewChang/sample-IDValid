import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { App, Button, Col, Popconfirm, Row, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import SettingTwoFactorBackupCodeContent from './Content';
import { cards, ctx, PageError } from 'src/components';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import type * as types from 'src/constants/types';

export default function SettingTwoFactorBackupCode() {
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()

  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [twoFactorSummary, setTwoFactorSummary] = useState<types.TWO_FACTOR_METHOD_SETTINGS>(ct.def.DEFAULT_TWO_FACTOR_METHOD_SETTINGS)
  const [backupCodes, setBackupCodes] = useState([])

  const readTwoFactorSummary = () => {
    setLoading(true)

    lib.tfa.readTwoFactorSummary()
      .then(readSuccess)
      .catch(({ rawError }) => {
        setRawError(rawError)
        setTwoFactorSummary(ct.def.DEFAULT_TWO_FACTOR_METHOD_SETTINGS)
      })
      .finally(() => setLoading(false))
  }

  const readSuccess = (res: types.TWO_FACTOR_METHOD_SETTINGS) => {
    setRawError(null)
    setTwoFactorSummary(res)

    if (!res.backup_code)
      generateCodes()
  }

  const readBackupCodes = async () => {
    setLoading(true)
    request({
      // pre
      checkIsAuthorized,
      deniedCallback: () => navigate(-1),
      // ---------
      urlKey: 'auth-security-backup-code',
      onSuccess: (res) => {
        setRawError(null)
        setBackupCodes(res)
      },
      onFailed: (error, _, rawError) => setRawError(rawError),
      onBoth: () => setLoading(false),
    })
  }

  const generateCodes = () => {
    setLoading(true)

    request({
      checkIsAuthorized,
      deniedCallback: () => setLoading(false),
      method: 'put',
      urlKey: 'auth-security-backup-code',
      onSuccess: (res) => setBackupCodes(res),
      onFailed: () => notification.error({ message: 'Failed regenerate backup codes' }),
      onBoth: () => setLoading(false),
    })
  }

  useEffect(readTwoFactorSummary, [])

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '24px' }}>
        {/* --------- PAGE ERROR --------- */}
        {rawError && (
          <cards.List cardProps={{ style: {marginTop: 0} }}>
            <PageError
              rawError={rawError}
              onReload={readTwoFactorSummary}
            />
          </cards.List>
        )}

        {/* --------- CONTENT --------- */}
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
                        <Popconfirm
                          placement="left"
                          title="The code will be overwritten"
                          description="The current backup code will not be usable."
                          okButtonProps={{ danger: true }}
                          onConfirm={generateCodes}
                        >
                          <Button icon={<EditOutlined />}>
                            Regenerate
                          </Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </cards.List>
            {twoFactorSummary.backup_code && (
              <cards.List title="Backup Codes">
                <div style={{ padding: '12px' }}>
                  <div style={{ margin: '12px' }}>
                    <SettingTwoFactorBackupCodeContent
                      backupCodes={backupCodes}
                      readBackupCodes={readBackupCodes}
                    />
                  </div>
                </div>
              </cards.List>
            )}
          </div>
        )}
      </div>
    </Spin>
  )
}