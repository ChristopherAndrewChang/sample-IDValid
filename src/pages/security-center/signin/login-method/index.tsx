import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { App, Button, Card, Col, Dropdown, Row, Spin } from 'antd';
import { CodeOutlined, EditOutlined, LaptopOutlined, LoginOutlined, MailOutlined, MoreOutlined, ProfileOutlined, RightOutlined, RobotOutlined, ShakeOutlined, TabletOutlined, UsbOutlined } from '@ant-design/icons';

import PasskeyIcon from 'src/components/TwoFactor/PasskeyIcon';
import { cards, ctx, PageError } from 'src/components';
import CardList from 'src/components/cards/List';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import type * as types from 'src/constants/types';
import DialogChangeEmail from './DialogChangeEmail';

export default function SecurityCenter() {
  const navigate = useNavigate()
  const { notification } = App.useApp()

  const { notifError } = ctx.useNotif()
  const { isAuthorized, checkIsAuthorized } = ctx.tfa.useTwoFactorContext()
  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loginMethods, setLoginMethods] = useState(null)
  const [visibleChangeEmail, setVisibleChangeEmail] = useState(false)

  const readLoginMethods = () => {
    console.log('readLoginMethods')
    setLoading(true)

    request({
      urlKey: 'auth-user-login-methods',
      onSuccess: (res) => {
        setRawError(null)
        setLoginMethods(res)
      },
      onFailed: (error, _, rawError) => setRawError(rawError),
      onBoth: () => setLoading(false),
    })
  }

  const changeEmail = () => {
    checkIsAuthorized(true).then(isAuthorized => {
      setVisibleChangeEmail(isAuthorized)
    })
  }

  useEffect(() => {
    readLoginMethods()
  }, [])

  return (
    <Spin spinning={loading}>
      <DialogChangeEmail
        visible={visibleChangeEmail}
        onClose={() => {
          console.log('onClose')
          setVisibleChangeEmail(false)
          readLoginMethods()
        }}
      />

      <div style={{ padding: '12px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ maxWidth: '840px' }}>
            <cards.List
              title="Login Methods"
              isError={!!rawError}
              errorProps={{
                rawError,
                onReload: readLoginMethods,
              }}
              items={[
                {
                  key: 'email',
                  name: 'Email Address',
                  description: 'You can use Email Address to login app',
                  // status: 'idris@evercore.technology',
                  status: loginMethods?.email,
                  icon: <MailOutlined />,
                  extra: (
                    <Dropdown
                      placement="bottomRight"
                      trigger={['click']}
                      menu={{
                        items: [
                          { key: 'change', label: 'Change', icon: <EditOutlined /> },
                        ],
                        onClick: ({ key }) => {
                          if (key === 'change')
                            changeEmail()
                        },
                      }}
                    >
                      <Button size="large" type="text" shape="circle" icon={<MoreOutlined />} />
                    </Dropdown>
                  ),
                },
              ]}
            >
            </cards.List>
          </div>
        </div>
      </div>
    </Spin>
  )
}