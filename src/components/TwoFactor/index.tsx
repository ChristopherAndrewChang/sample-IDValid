import { useEffect, useState } from 'react';
import { App, Card, Col, Divider, Modal, ModalProps, Row, Spin } from 'antd';

import { lib, request } from 'src/utils';
import ct from 'src/constants';

import * as types from 'src/constants/types';
import keys from 'src/constants/keys';
import TwoFactorAuthenticator from './Authenticator';
import TwoFactorBackupCode from './BackupCode';
import TwoFactorEmail from './Email';
import TwoFactorMobile from './Mobile';
import TwoFactorPin from './Pin';
import TwoFactorPasskey from './Passkey';
import PageError from '../PageError';

type PropTypes = {
  dialogProps?: ModalProps;
  // --------- PENGGANTI DIALOG PROPS ---------
  visible?: boolean;
  onClose?: (success?: boolean) => void;
}

export default function DialogTwoFactorAuthentication(props: PropTypes) {
  const { notification } = App.useApp()

  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [twoFactorSummary, setTwoFactorSummary] = useState<types.TWO_FACTOR_METHOD_SETTINGS>(null)
  // const [currentTwoFactor, setCurrentTwoFactor] = useState<types.TWO_FACTOR_METHOD>(null)
  const [availableMethods, setAvailableMethods] = useState<types.TWO_FACTOR_METHOD_ITEM[]>([])
  const [currentMethod, setCurrentMethod] = useState<types.TWO_FACTOR_METHOD_ITEM>(null)

  const readTwoFactorSummary = async () => {
    const isAuthorizedTwoFactor = lib.ls.getIsAuthorizedTwoFactor()
    if (isAuthorizedTwoFactor)
      return setTimeout(() => props.onClose(true), 250) // jika tanpa timeout, maka ada bug di antd modal, saat langsung visible false, maka ada div overlay yang belum terhapus, sehingga cursor tidak bisa klik manapun

    setLoading(true)

    const { headers } = lib.getEncryptedData()
    request({
      urlKey: 'auth-multi-factors-summary',
      headers,
      onSuccess(responseData, extra, response) {
        const availableMethods = ct.items.TWO_FACTOR_METHODS.filter(item => responseData[item.key])
        setAvailableMethods(availableMethods)
        // setTwoFactorSummary(responseData)
        setCurrentMethod(availableMethods[0])
        setRawError(null)
      },
      onFailed(responseData, extra, rawError) {
        notification.error({ message: 'Failed to read 2FA' })
        setRawError(rawError)

        // const testData = {"email":true,"phone":false,"authenticator":true,"security_code":true,"passkey":true,"backup_code":true}
        // const availableMethods = ct.items.TWO_FACTOR_METHODS.filter(item => testData[item.key])
        // setAvailableMethods(availableMethods)
        // setCurrentMethod(availableMethods[0])
      },
      onBoth() {
        setLoading(false)
      },
    })
  }

  const onCloseDialog = (success?: boolean, token?) => {
    console.log('onCloseDialog', success)

    if (token)
      lib.ls.assignUserToken(token)

    props.onClose(success)
  }

  useEffect(() => {
    if (props.visible)
      readTwoFactorSummary()
  }, [props.visible])

  const renderContent = () => {
    if (rawError) {
      return (
        <PageError
          rawError={rawError}
          onReload={readTwoFactorSummary}
        />
      )
    }

    if (currentMethod) {
      if (currentMethod.key === ct.keys.TWO_FACTOR_METHODS.AUTHENTICATOR) {
        return (
          <TwoFactorAuthenticator
            setLoading={setLoading}
            onClose={onCloseDialog}
          />
        )
      }

      if (currentMethod.key === ct.keys.TWO_FACTOR_METHODS.BACKUP_CODE) {
        return (
          <TwoFactorBackupCode
            setLoading={setLoading}
            onClose={onCloseDialog}
          />
        )
      }
      if (currentMethod.key === ct.keys.TWO_FACTOR_METHODS.EMAIL) {
        return (
          <TwoFactorEmail
            setLoading={setLoading}
            onClose={onCloseDialog}
          />
        )
      }

      if (currentMethod.key === ct.keys.TWO_FACTOR_METHODS.MOBILE) {
        return (
          <TwoFactorMobile
            setLoading={setLoading}
            onClose={onCloseDialog}
          />
        )
      }

      if (currentMethod.key === ct.keys.TWO_FACTOR_METHODS.PASSKEY) {
        return (
          <TwoFactorPasskey
            setLoading={setLoading}
            onClose={onCloseDialog}
          />
        )
      }

      // if (currentMethod.key === ct.keys.TWO_FACTOR_METHODS.PHONE)

      if (currentMethod.key === ct.keys.TWO_FACTOR_METHODS.SECURITY_CODE) {
        return (
          <TwoFactorPin
            setLoading={setLoading}
            onClose={onCloseDialog}
          />
        )
      }
    }

    return null
  }

  return (
    <Modal
      destroyOnClose
      open={props.visible}
      maskClosable={false}
      onCancel={() => props.onClose(false)}
      // title="Two Factor Authentication"
      title="2FA verification to continue"
      footer={null}
      // classNames={{ 'content': 'p-0' }}
      {...props.dialogProps}
    >
      <Spin spinning={loading}>
        {renderContent()}

        {!rawError && (
          <Card style={{ marginTop: '12px' }}>
            <div>
              <div className="font-bold">
                Use another methods :
              </div>
              <div>
                <ul style={{ margin: 0 }}>
                  {availableMethods.filter(method => method !== currentMethod).map(method => (
                    <li key={method.key}>
                      <span
                        className="link-primary"
                        style={{ fontWeight: 500 }}
                        onClick={() => setCurrentMethod(method)}
                      >
                        Use {method.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </Spin>
    </Modal>
  )
}