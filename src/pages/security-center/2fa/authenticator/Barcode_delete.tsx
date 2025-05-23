import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { QRCodeSVG } from 'qrcode.react';

import { lib, request } from 'src/utils';

export default function AuthenticatorBarcode() {
  const [rawError, setRawError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authData, setAuthData] = useState(null)

  const readBarcode = () => {
    setLoading(true)

    const { headers } = lib.getEncryptedData()
    request({
      urlKey: 'auth-security-authenticator',
      headers,
      onSuccess: (res) => {
        setAuthData(res)
      },
      onFailed: (error, _, rawError) => {
        setRawError(rawError)
        const test = {"pk":"3MvrSAj4HVehZoNBm_aOJbxbSg2XGrN24Dl-pkRQYreLBwk-ZW_Y29oigjXj4en3","url":"otpauth://totp/IDValid%3Aidris?secret=JCLK4HFSUEB63EBKEFQ5OSEZYDMY5MFCTDW6MYFWSS7HK5OGINGS543RUDHTAEEY&issuer=IDValid"}
        setAuthData(test)
      },
      onBoth: () => setLoading(false),
    })
  }

  useEffect(readBarcode, [])

  return (
    <Spin spinning={loading}>
      <QRCodeSVG
        size={192}
        value={authData?.url}
      />
    </Spin>
  )
}