import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { Avatar, Button, Col, Dropdown, Layout, Popover, Row, Spin, Tooltip } from 'antd';
import { LogoutOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { set } from 'lodash';

import LayoutHomeHeader from './header';
import LayoutHomeSider from './sider';
import { lib, request } from 'src/utils';
import ct from 'src/constants';
import { PageError } from 'src/components';
// import paths from 'src/routes/paths';

export default function LayoutHome() {
  set(window, 'lib', lib)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  console.log('searchParams', searchParams)

  // const [initializing, setInitializing] = useState<any>(true) // show/hide content
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)

  const setMappedProfile = (profile) => {
    setProfile({
      ...profile,
      initial: profile.name
        .split(' ')
        .filter((_, i: number) => i < 3)
        .map((val: string) => val[0].toUpperCase())
        .join(''),
    })
  }

  const readProfile = () => {
    setLoading(true)

    request({
      urlKey: 'auth-user-profile',
      onSuccess(responseData, extra, response) {
        setError(null)
        // setInitializing(false)
        setMappedProfile(responseData)
      },
      onFailed(responseData, extra, response) {
        setError(responseData)
        // test
        // setInitializing(false)
        // setMappedProfile({ name: 'Muhammad Idris' })
      },
      onBoth: () => setLoading(false),
    })
  }

  const onLogout = () => {
    const { headers } = lib.getEncryptedData()
    request({
      method: 'post',
      urlKey: 'auth-logout',
      headers,
      onBoth: () => {
        lib.ls.deleteUserToken()
        navigate('/signin')
      },
    })
  }

  useEffect(() => {
    readProfile()
  }, [])

  console.log('Rendered LayoutHome')

  if (loading)
    return <Spin fullscreen />

  if (error) {
    return (
      <PageError
        title="Initializing failed"
        extra={(
          <Row justify="center" gutter={[12, 12]}>
            <Col>
              <Button danger type="primary" icon={<LogoutOutlined />} onClick={() => lib.user.logout(navigate)}>
                Logout
              </Button>
            </Col>
            <Col>
              <Button type="primary" icon={<ReloadOutlined />} onClick={readProfile}>
                Reload
              </Button>
            </Col>
          </Row>
        )}
      />
    )
  }

  return (
    <Spin spinning={loading}>
        <Layout className="layout-home" style={{ height: '100vh' }}>
          <LayoutHomeHeader profile={profile} />
          <Layout>
            <LayoutHomeSider />
            <Layout style={{ overflowY: 'auto' }}>
              <Layout.Content>
                <Outlet context={{ test: [1, 2, 3], obj: { child: 'asdf', is: true } }} />
              </Layout.Content>
            </Layout>
          </Layout>
        </Layout>
    </Spin>
  )
}