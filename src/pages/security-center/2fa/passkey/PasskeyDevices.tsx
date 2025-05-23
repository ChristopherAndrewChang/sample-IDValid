import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { App, Button, Col, Dropdown, Popconfirm, Row, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, LaptopOutlined, MoreOutlined, PlusOutlined, SafetyCertificateTwoTone, SwitcherOutlined } from '@ant-design/icons';
import moment from 'moment';

import PasskeyIcon from 'src/components/TwoFactor/PasskeyIcon';
// import DialogTwoFactorAuthenticatorSetup from './Setup';
import { cards, ctx, PageError } from 'src/components';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import type * as types from 'src/constants/types';

type PropTypes = {
  setLoading: (loading: boolean) => void;
}

export default function SettingTwoFactorPasskeyDevices(props: PropTypes) {
  const { modal } = App.useApp()
  const { checkIsAuthorized } = ctx.tfa.useTwoFactorContext()
  const { notifError } = ctx.useNotif()

  const [rawError, setRawError] = useState(null)
  const [devices, setDevices] = useState([])

  const readPasskeyDevices = () => {
    props.setLoading(true)

    request({
      checkIsAuthorized,
      deniedCallback: () => setRawError(true),
      urlKey: 'auth-security-passkey',
      onSuccess: (res) => {
        setRawError(null)
        setDevices(res)
      },
      onFailed: (error, _, rawError) => {
        setRawError(rawError)
        setDevices([])
      },
      onBoth: () => props.setLoading(false),
    })
  }

  const deletePasskeyDevice = async (passkeyDevice) => {
    await new Promise((resolve) => {
      modal.confirm({
        title: 'Delete Passkey Device',
        content: 'Are you sure want to delete the Passkey Device?',
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: () => resolve(true),
      })
    })

    props.setLoading(true)
    request({
      checkIsAuthorized,
      method: 'delete',
      urlKey: 'auth-security-passkey-detail',
      args: [passkeyDevice.subid],
      onSuccess: readPasskeyDevices,
      onFailed: () => {
        props.setLoading(false)
        notifError(rawError)
      },
    })
  }

  useEffect(readPasskeyDevices, [])

  return (
    <cards.List
      title="Your Passkeys"
      items={devices.map(device => ({
        key: device.subid,
        name: 'Passkey Device',
        description: moment(device.created_at).format('[Created at] DD MMM YYYY'),
        status: device.last_used_at && moment(device.last_used_at).format('[Last used at] DD MMM YYYY'),
        icon: <LaptopOutlined />,
        extra: (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'delete', danger: true, label: 'Delete', icon: <DeleteOutlined /> },
              ],
              onClick: ({ key }) => {
                if (key === 'delete')
                  deletePasskeyDevice(device)
              },
            }}
          >
            <Button size="large" type="text" shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        ),
      }))}
    >
      {rawError
        ? <PageError rawError={rawError} onReload={readPasskeyDevices} />
        : devices.length === 0 && (
        <PageError
          title="No Passkey Device"
          subTitle=""
          extra={null}
        />
      )}
    </cards.List>
  )
}