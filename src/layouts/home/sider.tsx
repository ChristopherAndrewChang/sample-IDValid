import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, InfoCircleOutlined, SafetyCertificateOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { has } from 'lodash';

import ct from 'src/constants';

import type { MenuProps } from 'antd';

type CustomMenuItem = MenuProps['items'][number] & { path?: string }

const menuItems: CustomMenuItem[] = [
  {
    key: removeTrailingSlash(ct.paths.MAIN),
    label: 'Home',
    icon: <DashboardOutlined />,
    path: ct.paths.MAIN,
  },
  {
    key: removeTrailingSlash(ct.paths.MAIN_HOME_SECURITY),
    label: 'Security Center',
    icon: <SafetyCertificateOutlined />,
    path: ct.paths.MAIN_HOME_SECURITY,
  },
  { type: 'divider' },
  {
    key: removeTrailingSlash(ct.paths.MAIN_HOME_ABOUT),
    label: 'About',
    icon: <InfoCircleOutlined />,
    path: ct.paths.MAIN_HOME_ABOUT,
  },
  // { type: 'group', children: [] },
].map((item) => ({
  ...item,
  label: item.path
    ? <Link to={item.path}>{item.label}</Link>
    : item.label,
}) as CustomMenuItem)

function removeTrailingSlash(pathname: string): string {
  return pathname === '/'
    ? pathname
    : pathname.replace(/\/+$/, '')
}

function getPathSegments(pathname: string) {
  pathname = removeTrailingSlash(pathname)

  const parts = pathname.split('/')//.filter(val => val)
  const result = []

  for (let i = 0; i < parts.length; i++)
    result.push(parts.slice(0, i + 1).join('/'))

  return result.filter(Boolean)
}

// function generateKey(pathname: string, alt?: string) {
//   return pathname
//     .split('/')
//     .filter(val => val)
//     .join('/') || alt
// }

// const getSelectedItem = (pathname: string): CustomMenuItem => {
//   return menuItems.find(menuItem => menuItem.path === pathname)
// }

// const getSelectedKey = (pathname: string): string => {
//   return getSelectedItem(pathname)?.key as string
// }

export default function LayoutHomeSider() {
  const navigate = useNavigate()
  const location = useLocation()

  console.log('location', location)

  const findMenuItem = (items: CustomMenuItem[], key: string): CustomMenuItem => {
    for (const item of items) {
      if (item.key === key) return item
      if ('children' in item) {
        const foundItem = findMenuItem(item.children, key)
        if (foundItem)
          return foundItem
      }
    }

    return null
  }

  const onClickMenu = (e) => {
    // const menuItem = findMenuItem(menuItems, e.key)
    // console.log('onClickMenu', e, menuItem)

    // if (has(menuItem, 'path'))
    //   navigate(menuItem.path)
  }

  return (
    <Layout.Sider theme="light" width={280} style={{ position: 'sticky', top: 0 }}>
      <div>
        <Menu
          // selectedKeys={[selectedKey]}
          selectedKeys={getPathSegments(location.pathname)}
          items={menuItems}
          style={{ borderRight: 'none', padding: '12px' }}
          onClick={onClickMenu}
        />
      </div>
    </Layout.Sider>
  )
}