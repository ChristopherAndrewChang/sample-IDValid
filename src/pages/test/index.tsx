import { useState } from 'react';
import { Link, NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { Button, Card, Col, Flex, Row, Spin, Tag, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import appConfig from 'src/config/app';
import { lib } from 'src/utils';
import ct from 'src/constants';
import CardTwoFactor from './TwoFactor';
import CardPasskey from './Passkey';
import CardPasskeyDevices from './PasskeyDevices';
import TestTwoFactor from 'src/components/TwoFactor';

import logo from 'src/assets/images/logo.png';

export default function Test(props) {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  console.log('Home', props, {params, searchParams})

  const testConnect = async () => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)

    // --------- TEST GENERATE LINK ---------
    navigate(ct.paths.MAIN_INTEGRATION + lib.getStrParam({
      client_id: appConfig.test.client_id,
      redirect_uri: encodeURIComponent('https://dev-api.ibes.co.nz'),
      response_type: 'code',
      scope: 'openid',
      code_challenge: 'VATpgpZ3ighUS6Ac2TZw8soEbdc2jtJaHaoh8WOyTGU', // ibes-application
      code_challenge_method: 'S256',
      state: uuidv4().replace(/-/g, ''),
      nonce: 'qwe123asd',
    }))
  }

  return (
    <div style={{ height: '100%' }}>
      <Row justify="center" align="middle" style={{ height: '100%' }}>
        <Col>
          <Row gutter={[12, 12]}>
            <Col>
              <Link to="/">
                Home
              </Link>
            </Col>
            <Col>
              <Spin spinning={loading}>
                <Card className="card-hovered" style={{ margin: '24px',  width: '320px', maxWidth: 'calc(100% - 24px - 24px)' }}>
                  <Flex vertical align="center" justify="center" gap={12} style={{ position: 'relative' }}>
                    <Tag color="blue" style={{ position: 'absolute', top: 0, right: 0, marginRight: 0, padding: '2px 12px', fontWeight: 500, fontSize: '16px' }}>
                      IBES
                    </Tag>
                    <img
                      src={logo}
                      width={200}
                      height={200}
                    />
                    <div style={{ marginTop: '-12px', marginBottom: '12px' }}>
                      <Typography.Title style={{ marginTop: 0, marginBottom: '12px', textAlign: 'center' }}>
                        IDValid
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'justify' }}>
                        IDVal simplifies identity verification for secure and seamless access. Verify once, then log in effortlessly to partner apps. With features like PINs, OTPs, and push notifications, we ensure convenience and top-notch security.
                      </Typography.Text>
                    </div>
                    <Button block size="large" shape="round" type="primary" onClick={testConnect}>
                      Connect
                    </Button>
                  </Flex>
                </Card>
              </Spin>
            </Col>
            <Col>
              <CardTwoFactor />
            </Col>
            <Col>
              <CardPasskey />
            </Col>
            <Col>
              <CardPasskeyDevices />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}