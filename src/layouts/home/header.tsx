import { Link, useNavigate } from 'react-router';
import { Avatar, Col, Dropdown, Image, Layout, Row } from 'antd';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

import DropdownTenant from './dropdown-tenant';
import { lib } from 'src/utils';

import type { MenuProps } from 'antd';

import logo from 'src/assets/images/logo.png';

export default function LayoutHomeHeader({ profile }) {
  const navigate = useNavigate()
  console.log('navigate', navigate)
  const menuItems: MenuProps['items'] = [
    {
      type: 'group',
      label: (
        <div>
          <div className="mb-1 font-weight-semibold" style={{ color: 'rgba(0, 0, 0, 0.65)', fontSize: '24px' }}>
            Hi, {profile.name}!
          </div>
          <div className='link-primary'>
            Manage my profile
          </div>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'test',
      label: 'Test',
      onClick: () => navigate('/test'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      // disabled: true,
      label: 'Logout',
      icon: <LogoutOutlined />,
      // extra: '⌘S',
      onClick: () => lib.user.logout(navigate),
    },
  ]

  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      navigate
    }
  }

  return (
    <Layout.Header className="home-header">
      <Row justify="space-between" wrap={false}>
        <Col>
          <Link to="/">
            <Row wrap={false} style={{ userSelect: 'none' }}>
              <img
                draggable={false}
                width={64}
                src={logo}
              />
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                <span style={{ color: '#008cdb' }}>
                  ID
                </span>
                <span style={{ color: '#5fc3fe' }}>
                  VALID
                </span>
              </span>
            </Row>
          </Link>
        </Col>
        <Col>
          <Row wrap={false} gutter={[12, 0]}>
            <Col>
              {/* <Dropdown
                placement="bottomRight"
                trigger={['click']}
                menu={{
                  items: [
                    { key: '1', label: 'Menu 1' },
                    { key: '2', label: 'Menu 2' },
                    { type: 'divider' },
                    { key: '3', label: 'Menu 3' },
                  ]
                }}
                dropdownRender={(menus) => (
                  <div>
                    <div>
                      Here
                    </div>
                    {menus}
                  </div>
                )}
              >
                Tenant
              </Dropdown> */}
              <DropdownTenant />
            </Col>
            <Col>
              {/* <Popover trigger="click" placement="bottomRight" content="asdf"> */}
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                menu={{ items: menuItems, onClick: onMenuClick }}
              >
                <div title={profile.name}>
                  <Avatar className="menu-avatar-user">
                    {profile.initial}
                  </Avatar>
                </div>
              </Dropdown>
              {/* </Popover> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  )
}