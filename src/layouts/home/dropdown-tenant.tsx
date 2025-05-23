import { useEffect, useState } from 'react';
import { Avatar, Dropdown, Spin } from 'antd';
import { CaretUpOutlined, ShopOutlined, WarningOutlined } from '@ant-design/icons';
import { get, set } from 'lodash';

import { ctx } from 'src/components';
import { lib, request } from 'src/utils';

import type { MenuProps } from 'antd';

export default function DropdownTenant() {
  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()

  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState([])
  const [currentTenant, setCurrentTenant] = useState(null)
  const [visibleDropdown, setVisibleDropdown] = useState(false)

  const readTenants = async () => {
    return new Promise((resolve, reject) => {
      request({
        urlKey: 'tenant-tenants',
        onSuccess: (res) => {
          console.log('success read tenants', res)
          setTenants(res)
          resolve(res)
        },
        onFailed: (error, _, rawError) => reject({error, rawError}),
      })
    })
  }

  const readCurrentTenant = async () => {
    return new Promise((resolve, reject) => {
      request({
        // checkIsAuthorized,
        deniedCallback: () => reject({ error: true }),
        urlKey: 'tenant-profile',
        onSuccess: (res) => {
          setCurrentTenant(res)
          resolve(true)
        },
        onFailed: (error, _, rawError) => reject({error, rawError}),
      })
    })
  }

  const readUsers = async () => {
    request({
      urlKey: 'tenant-users',
    })
  }

  const prepare = () => {
    setLoading(true)
    readTenants()
      .then(() => readCurrentTenant())
      .catch(({ error, rawError }) => setRawError(rawError))
      .finally(() => setLoading(false))
  }

  const mapTenantItem = (tenant) => {
    return {
      key: tenant.subid || tenant.id, // tenant-profile menggunakan "id"
      label: tenant.name,
      icon: !tenant.is_active && <WarningOutlined style={{ color: '#ffc354' }} />,
      disabled: !tenant.is_active,
    }
  }

  const getTenantItems = (): MenuProps['items'] => {
    const availableTenants = tenants.filter(tenant => tenant.subid !== currentTenant?.id)
    const activeTenants = availableTenants.filter(tenant => tenant.is_active)
    const inactiveTenants = availableTenants.filter(tenant => !tenant.is_active)

    return [
      {
        type: 'group',
        label: 'Current Tenant',
        children: [currentTenant]
          .filter(v => v)
          .map(mapTenantItem),
      },
      {
        type: 'group',
        label: 'Accessible Tenants',
        children: activeTenants.map(mapTenantItem),
      },
      {
        type: 'group',
        label: 'Inactive Tenants',
        children: inactiveTenants.map(mapTenantItem),
      },
    ].filter(item => item.children.length) as MenuProps['items']
  }

  const onClickMenu = ({ key }) => {
    if (currentTenant?.id !== key)
      selectTenant(key)
  }

  const selectTenant = (tenantId: string) => {
    setLoading(true)

    request({
      checkIsAuthorized,
      onBefore: (options) => {
        const { headers, encValues } = lib.getEncryptedData([tenantId])
        options.headers = { ...options.headers, ...headers }
        options.data = { tenant: encValues[0] }
        console.log('onBefore', { headers, encValues, options })
      },
      method: 'post',
      urlKey: 'auth-tenant',
      onSuccess: (res) => {
        lib.ls.assignUserToken(res)
        readCurrentTenant()
      },
      onFailed: (error, _, rawError) => null,
      onBoth: () => setLoading(false),
    })
  }

  useEffect(prepare, [])

  console.log('Rendered tenants', tenants)

  return (
    <Spin spinning={loading}>
      {tenants.length > 0 && (
        <Dropdown
          open={visibleDropdown}
          className="dropdown-tenant"
          placement="bottomRight"
          trigger={['click']}
          menu={{
            selectedKeys: currentTenant
              ? [currentTenant.id]
              : [],
            items: getTenantItems(),
            onClick: onClickMenu,
          }}
          onOpenChange={(open) => setVisibleDropdown(open)}
        >
          <span>
            <ShopOutlined style={{ marginRight: '6px' }} />
            <span className="anticon">
              <div>
                {get(currentTenant, 'name', '(No Tenant Selected)')}
              </div>
            </span>
            {tenants.length > 1 && (
              <CaretUpOutlined
                className="ml-1 icon-transition"
                rotate={visibleDropdown ? 0 : 180}
                style={{ fontSize: '12px', marginLeft: '6px' }}
              />
            )}
          </span>
        </Dropdown>
      )}
    </Spin>
  )
}