import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { Button, Card, Col, Flex, notification, Row, Spin, Tag, Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

import DialogTwoFactorAuthentication from 'src/components/TwoFactor';
import { lib, request } from 'src/utils';

import logo from 'src/assets/images/logo.png';

import type * as types from 'src/constants/types';

function TestRender({ render }) {
  const [dummy, setDummy] = useState(0)

  useEffect(() => {
    // const _interval = setInterval(() => setDummy((dummy) => dummy + 1), 1000)

    // return () => clearInterval(_interval)
  }, [])

  console.log('dummy', dummy)

  return render()
}

export default function TestTwoFactor() {
  const [loading, setLoading] = useState(false)
  const [dummy, setDummy] = useState<any>(false)
  const [twoFactorExpiredTime, setTwoFactorExpiredTime] = useState(null)
  const [visibleTwoFactor, setVisibleTwoFactor] = useState(false)

  const updateTwoFactorExpiredTime = () => {
    const objAccessToken = jwtDecode<types.ACCESS_TOKEN>(lib.ls.getUserToken().access_token)
    console.log('updateTwoFactorExpiredTime objAccessToken', objAccessToken)

    setTwoFactorExpiredTime(objAccessToken.mfe
      ? Number(objAccessToken.mfe) * 1000
      : null)
  }

  const testVerify = () => {
    const { headers, encValues } = lib.getEncryptedData(['123456'])
    request({
      method: 'post',
      urlKey: 'auth-multi-factors-security-code',
      headers,
      data: { pin: 123456 },
      onSuccess(responseData) {
        console.log('onSuccess responseData', responseData)
        lib.ls.assignUserToken(responseData)
        updateTwoFactorExpiredTime()
      },
      onFailed(responseData, extra, response) {
        console.log('verify 2fa failed', response)
        // notification.error({ message: 'Verify multi factor failed' })
      },
    })
  }

  useEffect(() => {
    updateTwoFactorExpiredTime()
  }, [])

  console.log('twoFactorExpiredTime', twoFactorExpiredTime)

  return (
    <Spin spinning={loading}>
      <DialogTwoFactorAuthentication
        visible={visibleTwoFactor}
        onClose={(success) => setVisibleTwoFactor(false)}
      />

      <Card className="card-hovered" style={{ margin: '24px',  width: '320px', maxWidth: 'calc(100% - 24px - 24px)' }}>
        <Flex vertical align="center" justify="center" gap={12} style={{ position: 'relative' }}>
          {/* <Tag color="blue" style={{ position: 'absolute', top: 0, right: 0, marginRight: 0, padding: '2px 12px', fontWeight: 500, fontSize: '16px' }}>
            IBES
          </Tag> */}
          <img
            src={logo}
            width={200}
            height={200}
            onClick={testVerify}
          />
          <div style={{ marginTop: '-12px', marginBottom: '12px' }}>
            <Typography.Title style={{ marginTop: 0, marginBottom: '12px', textAlign: 'center' }}>
              2FA
            </Typography.Title>
            <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'justify' }}>
              Verify 2FA before setting up multi-factor, such as Passkey.
            </Typography.Text>
            <div style={{ marginTop: '44px' }}>
              <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'justify' }}>
                Multi factor expired :
              </Typography.Text>
              <Typography.Text type="warning" style={{ display: 'block', fontWeight: 'bold', textAlign: 'justify' }}>
                {moment(twoFactorExpiredTime).format('llll')}
                <TestRender
                  render={() => (
                    moment(twoFactorExpiredTime).diff(moment()) < 0 && (
                      <Typography.Text type="danger" style={{ marginLeft: '6px' }} onClick={() => setDummy(Math.random())}>
                        (expired)
                      </Typography.Text>
                    )
                  )}
                />
              </Typography.Text>
            </div>
          </div>
          <Row wrap={false} gutter={[6, 0]} style={{ width: '100%' }}>
            <Col flex="auto">
              <Button block size="large" shape="round" type="primary" onClick={() => setVisibleTwoFactor(true)}>
                Verify
              </Button>
            </Col>
          </Row>
        </Flex>
      </Card>
    </Spin>
  )
}