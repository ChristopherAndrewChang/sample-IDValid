import { useEffect, useState } from 'react';
import { Col, Row } from 'antd';

type PropTypes = {
  backupCodes: string[],
  readBackupCodes: () => void;
}

export default function SettingTwoFactorBackupCodeContent({
  backupCodes,
  readBackupCodes,
}: PropTypes) {

  useEffect(() => {
    readBackupCodes()
  }, [])

  return (
    <Row justify="center">
      <Col style={{ maxWidth: '640px' }}>
        <Row gutter={[12, 12]}>
          {backupCodes.map(backupCode => (
            <Col key={backupCode} span={12} style={{ fontSize: '24px', textAlign: 'center' }}>
              {backupCode}
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}