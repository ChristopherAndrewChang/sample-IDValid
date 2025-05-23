import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { App, Button, Card, Col, Flex, Row, Spin, Tag } from 'antd';
import { MailOutlined, UserSwitchOutlined } from '@ant-design/icons';

import DialogTwoFactorAuthentication from 'src/components/TwoFactor';
import Test from './Test';
import { lib, request } from 'src/utils';
import ct from 'src/constants';

import type * as types from 'src/constants/types';

export default function ThirdPartyIntegration() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const objSearchParams = lib.getObjSearchParams(searchParams)
  const { notification } = App.useApp()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [thirdAppDetail, setThirdAppDetail] = useState<types.THIRD_APP_DETAIL | null>(null)
  const [loginMethod, setLoginMethod] = useState(null)
  const [profile, setProfile] = useState(null)
  const [visibleTwoFactor, setVisibleTwoFactor] = useState(true)

  const [thidAppParams, setThirdAppParams] = useState(null)

  console.log('objSearchParams', objSearchParams)
  console.log('thidAppParams', thidAppParams)

  // const { headers, encValues } = lib.getEncryptedData(['nama saya'])
  // console.log({headers, encValues})

  const readLoginMethod = () => {
    request({
      urlKey: 'auth-user-login-methods',
      onSuccess: setLoginMethod,
      // onFailed: () => null,
    })
  }

  const readProfile = () => {
    request({
      urlKey: 'auth-user-profile',
      onSuccess: setProfile,
    })
  }

  const retrieveThirdParty = () => {
    setLoading(true)

    request({
      urlKey: 'oauth-user-authorize',
      params: {
        client_id: objSearchParams.client_id,
        redirect_uri: decodeURIComponent(objSearchParams.redirect_uri),
        scope: objSearchParams.scope,
      },
      onSuccess: (res) => {
        console.log('Third party', res)
        setLoading(false)
        setThirdAppDetail(res)
      },
      onFailed: (error) => {
        console.log('onFailed', error)
        setLoading(false)
      },
    })
  }

  const getThirdAppName = () => thirdAppDetail?.client_name

  const switchUser = () => {
    // lib.ls.deleteUserToken()
    navigate(ct.paths.PUBLIC_SIGNIN + lib.getStrParam({
      next: encodeURIComponent(location.pathname + location.search)
    }))
  }

  const onCancel = () => {
    navigate(ct.paths.MAIN)
    // if (objSearchParams.redirect_uri)
    //   location.href = objSearchParams.redirect_uri
  }

  const authorize = () => {
    setLoading(true)
    setThirdAppParams(null)

    request({
      method: 'post',
      urlKey: 'oauth-user-authorize',
      data: {
        client_id: objSearchParams.client_id,
        redirect_uri: decodeURIComponent(objSearchParams.redirect_uri),
        response_type: objSearchParams.response_type,
        scope: objSearchParams.scope,
        code_challenge: objSearchParams.code_challenge,
        code_challenge_method: 'S256',
        state: objSearchParams.state,
        nonce: objSearchParams.nonce,
      },
      onSuccess: (res) => {
        setLoading(false)

        notification.success({ message: 'Success to authorize third app' })

        // if (res.url)
        //   location.href = res.url

        const strParams = res.url.split('?')?.[1]
        const objParams = lib.getObjParam(strParams)
        console.log('objParams', objParams)
        if (objParams?.code)
          setThirdAppParams(objParams)
      },
      onFailed: (error) => {
        setLoading(false)

        notification.error({ message: 'Failed to authorize third app' })

        const exampleRes = { url: 'https://dev-api.ibes.co.nz?code=GuIpmGsKIb5HHR7mBujNK9DKigm2FF&state=8cff42e8a5084585905b54a1f9a32534' }
        const strParams = exampleRes.url.split('?')?.[1]
        console.log('exampleRes')
        // setThirdAppParams(lib.getObjParam(strParams))
      },
    })
  }

  useEffect(() => {
    retrieveThirdParty()
    readLoginMethod()
    readProfile()
  }, [])

  // if (!thirdAppDetail)
  //   return <Spin />

  if (visibleTwoFactor) {
    return (
      <DialogTwoFactorAuthentication
        visible={visibleTwoFactor}
        onClose={(success) => {
          console.log('onClose 2FA', success)
          setVisibleTwoFactor(false)

          if (!success)
            navigate(-1)
        }}
      />
    )
  }

  console.log('Rendered Integration', { visibleTwoFactor })

  const email = loginMethod?.email || profile?.name

  return (
    <Row justify="center" align="middle" style={{ height: '100%' }}>
      <Col>
        <Spin spinning={loading}>
          <Card className="card-hovered" title="Sign in with IDValid" style={{ margin: '24px', width: '1040px', maxWidth: 'calc(100% - 24px - 24px)' }}>
            <Row wrap={false} gutter={[48, 48]} style={{ marginBottom: '48px' }}>
              <Col flex="1 1 50%">
                <div style={{ fontSize: '44px' }}>
                  Connect to {getThirdAppName()}
                </div>
                {email && (
                  <div style={{ marginTop: '12px' }}>
                    <Tag style={{ color: '#7c7c7c', fontSize: '1rem', fontWeight: 500, padding: '4px 12px' }}>
                      <MailOutlined style={{ marginRight: '8px' }} />
                      {email}
                    </Tag>
                  </div>
                )}
              </Col>
              <Col flex="1 1 50%">
                <div style={{ marginBottom: '24px' }}>
                  By continuing, IDValid will share your name, email address, language preference, and profile picture with <b>{getThirdAppName()}</b>. See <b>{getThirdAppName()}</b> Privacy Policy and Terms of Service.
                </div>
                <div>
                  You can manage Sign in with IDValid in your <b>IDValid Account</b>.
                </div>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col flex="1 1 50%" style={{ paddingRight: '24px' }}>
                <Button size="large" shape="round" icon={<UserSwitchOutlined />} onClick={switchUser}>
                  Use another account
                </Button>
              </Col>
              <Col flex="1 1 50%" style={{ paddingLeft: '24px' }}>
                <Row gutter={[12, 12]}>
                  <Col flex="auto">
                    <Button block size="large" shape="round" onClick={onCancel}>
                      Cancel
                    </Button>
                  </Col>
                  <Col flex="auto">
                    <Button block type="primary" size="large" shape="round" onClick={authorize}>
                      Continue
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Spin>
        {thidAppParams && (
          <div style={{ margin: '24px' }}>
            <Test
              client_id={objSearchParams.client_id}
              redirect_uri={objSearchParams.redirect_uri}
              code={thidAppParams.code}
              state={thidAppParams.state}
            />
          </div>
        )}
      </Col>
    </Row>
  )
}