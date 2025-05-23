import { useNavigate } from 'react-router';
import { createContext, useContext, useRef, useState } from 'react';
import { App, Button } from 'antd';

import DialogTwoFactorAuthentication from 'src/components/TwoFactor';
import { lib } from 'src/utils';
import ct from 'src/constants';
import { LogoutOutlined } from '@ant-design/icons';

import type * as types from 'src/constants/types';

type ContextType = {
  isAuthorized: boolean;
  twoFactorSummary: types.TWO_FACTOR_METHOD_SETTINGS;
  validateError: (rawError?) => void;
  checkIsAuthorized: (forceVisibleChildren?: boolean) => Promise<boolean>;
  readSummary: () => Promise<types.TWO_FACTOR_METHOD_SETTINGS>;
}

const TwoFactorContext = createContext<ContextType>(null)

export function TwoFactorProvider({ children }) {
  const userTokenObject = lib.ls.getUserTokenObject('access_token')

  const navigate = useNavigate()
  const _resolveChecking = useRef(null)
  const { notification } = App.useApp()
  const [isFirstLogin, setIsFirstLogin] = useState(!userTokenObject?.mfa)
  const [isAuthorized, _setIsAuthorized] = useState(userTokenObject ? userTokenObject.mfa : true)
  const [forceVisibleChildren, setForceVisibleChildren] = useState(false)
  const [twoFactorSummary, setTwoFactorSummary] = useState<types.TWO_FACTOR_METHOD_SETTINGS>(ct.def.DEFAULT_TWO_FACTOR_METHOD_SETTINGS)

  const setIsAuthorized = (isAuthorized: boolean, forceVisibleChildren = false) => {
    console.log('20250514 setIsAuthorized', isAuthorized)
    setIsFirstLogin(false)
    _setIsAuthorized(isAuthorized)
    setForceVisibleChildren(forceVisibleChildren)
  }

  const checkIsAuthorized = async (forceVisibleChildren?: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      _resolveChecking.current = resolve

      const isAuthorized = lib.ls.getIsAuthorizedTwoFactor()
      console.log('20250514 checkIsAuthorized', isAuthorized)

      setIsAuthorized(isAuthorized, forceVisibleChildren)

      if (isAuthorized)
        _resolveChecking.current(isAuthorized)
    })
  }

  const validateError = (rawError) => {
    console.log('2FA validateError', rawError)
    if (lib.tfa.getIsErrorMultiFactorRequired(rawError)) {
      console.log('here')
      setIsAuthorized(false)
    }
  }

  const readSummary = async (): Promise<types.TWO_FACTOR_METHOD_SETTINGS> => {
    return new Promise((resolve, reject) => {
      lib.tfa.readTwoFactorSummary()
        .then((res) => {
          setTwoFactorSummary(res)
          resolve(res)
        })
        .catch(reject)
    })
  }

  return (
    <TwoFactorContext.Provider
      value={{
        isAuthorized,
        twoFactorSummary,
        checkIsAuthorized,
        readSummary,
        validateError,
      }}
    >
      <DialogTwoFactorAuthentication
        visible={!isAuthorized}
        onClose={(success) => {
          console.log('20250514 onClose', success, _resolveChecking)
          // setIsAuthorized(success)

          if (isFirstLogin && !success)
            notification.warning({
              key: '2fa-required',
              message: '2FA is required',
              description: 'You have to pass 2FA to proceed to the main page.',
              actions: (
                <Button
                  danger
                  size="small"
                  type="primary"
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    notification.destroy('2fa-required')
                    lib.user.logout(navigate)
                    // lib.ls.deleteUserToken()
                    // navigate(ct.paths.PUBLIC_SIGNIN, { replace: true })
                  }}
                >
                  Logout
                </Button>
              ),
            })
          else
            setIsAuthorized(true)

          if (_resolveChecking.current)
            _resolveChecking.current(success)
        }}
      />
      {!isFirstLogin && (
        <div className="tfa-container" style={{ display: (isAuthorized || forceVisibleChildren) ? 'block' : 'none' }}>
          {children}
        </div>
      )}
    </TwoFactorContext.Provider>
  )
}

export function useTwoFactorContext() {
  const context = useContext(TwoFactorContext)
  if (!context)
    throw new Error('"useTwoFactorContext" must be used in <TwoFactorProvider>')

  return context
}