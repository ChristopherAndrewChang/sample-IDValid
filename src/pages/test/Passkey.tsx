import { useState } from 'react';
import { Link, NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { App, Button, Card, Col, Flex, Row, Spin, Tag, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import appConfig from 'src/config/app';
import { lib } from 'src/utils';
import ct from 'src/constants';

import logo from 'src/assets/images/logo.png';

export default function TestPasskey() {
  const { notification } = App.useApp()

  const [loading, setLoading] = useState(false)
  const [passkeyCreated, setPasskeyCreated] = useState(false)

  const createPasskey = async () => {
    lib.passkey.register()
      .catch(e => {
        console.error('Failed register passkey : ', e.toString())
        notification.error({ message: e.toString() })
      })
  }

  const verifyPasskey = async () => {
    lib.passkey.verify()
      .then(token => lib.ls.assignUserToken(token))
      .catch(e => {
        console.error('Failed register passkey : ', e.toString())
        notification.error({ message: e.toString() })
      })
  }

  return (
    <Spin spinning={loading}>
      <Card className="card-hovered" style={{ margin: '24px',  width: '320px', maxWidth: 'calc(100% - 24px - 24px)' }}>
        <Flex vertical align="center" justify="center" gap={12} style={{ position: 'relative' }}>
          {/* <Tag color="blue" style={{ position: 'absolute', top: 0, right: 0, marginRight: 0, padding: '2px 12px', fontWeight: 500, fontSize: '16px' }}>
            IBES
          </Tag> */}
          <img
            src={logo}
            width={200}
            height={200}
          />
          <div style={{ marginTop: '-12px', marginBottom: '12px' }}>
            <Typography.Title style={{ marginTop: 0, marginBottom: '12px', textAlign: 'center' }}>
              Passwordless
            </Typography.Title>
            <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'justify' }}>
              Passkeys are encrypted digital keys you create using your fingerprint, face or other screen-lock method. Passkeys protect you from phising attacks. They are saved to a password manager, so you can sign in on other devices.
            </Typography.Text>
          </div>
          <Row wrap={false} gutter={[6, 0]} style={{ width: '100%' }}>
            <Col flex="1 1 50%">
              <Button block size="large" shape="round" type="primary" onClick={createPasskey}>
                Create a passkey
              </Button>
            </Col>
            <Col flex="1 1 50%">
              <Button block size="large" shape="round" type="primary" onClick={verifyPasskey}>
                Verify
              </Button>
            </Col>
          </Row>
        </Flex>
      </Card>
    </Spin>
  )
}