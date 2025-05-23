import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams, useSearchParams } from 'react-router';
import { Button, Card, Col, Flex, notification, Row, Spin, Tag, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import appConfig from 'src/config/app';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import logo from 'src/assets/images/logo.png';

export default function TestPasskeyDevices() {
  const testPasskeyDevice1 = {"subid":"N5KneSJJZkyH_9yqW4rzz78Tvp_J9v6ozCO98ycS9IpR-Kqh70wJKc4P2yrSC3x1","created_at":"2025-03-19T06:50:17.252633Z","last_used_at":"2025-03-20T06:53:34.414264Z"}
  const testPasskeyDevice2 = {"subid":"N5KneSJJZkyH_9yqW4rzz78Tvp_J9v6ozCO98ycS9IpR-Kqh70wJKc4P2yrSC3x2","created_at":"2025-03-19T06:50:17.252633Z","last_used_at":"2025-03-20T06:53:34.414264Z"}
  const [loading, setLoading] = useState(false)
  const [passkeyDevices, setPasskeyDevices] = useState([])

  const readPasskeyDevices = () => {
    setLoading(true)

    request({
      urlKey: 'auth-security-passkey',
      onSuccess(responseData, extra, response) {
        setPasskeyDevices(responseData)
      },
      onBoth() {
        setLoading(false)
      },
    })
  }

  const deletePasskey = (passkeyDevice) => {
    setLoading(true)

    request({
      method: 'delete',
      urlKey: 'auth-security-passkey-detail',
      args: [passkeyDevice.subid],
      onSuccess: readPasskeyDevices,
      onFailed(responseData, extra, response) {
        setLoading(false)
      },
    })
  }

  useEffect(() => {
    readPasskeyDevices()
  }, [])

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
              Passkey Device
            </Typography.Title>
            {passkeyDevices.map(passkeyDevice => (
              <div key={passkeyDevice.subid} style={{ border: '1px solid #e8e8e8', borderRadius: '4px', margin: '12px 0', padding: '4px 8px' }}>
                <Row justify="space-between">
                  <div style={{ fontWeight: 'bold' }}>
                    Passkey
                  </div>
                  <Typography.Text type="danger" style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => deletePasskey(passkeyDevice)}>
                    Delete
                  </Typography.Text>
                </Row>
                <div>
                  <Typography.Text type="secondary" style={{ display: 'block' }}>
                    Added on {moment(passkeyDevice.created_at).format('MMM DD, YYYY')}
                  </Typography.Text>
                  {passkeyDevice.last_used_at && (
                    <Typography.Text type="secondary" style={{ display: 'block' }}>
                      Last used {moment(passkeyDevice.last_used_at).fromNow()}
                    </Typography.Text>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button block size="large" shape="round" type="primary" onClick={readPasskeyDevices}>
            Reload
          </Button>
        </Flex>
      </Card>
    </Spin>
  )
}