import { useEffect, useState } from 'react';
import { App, Button, Col, Flex, Input, notification, Spin } from 'antd';

import { request } from 'src/utils';

type PropTypes = {
  client_id: string;
  redirect_uri: string;
  code: string;
  state?: string;
}

export default function TestThirdParty(props: PropTypes) {
  const { notification } = App.useApp()

  const [loading, setLoading] = useState(false)
  const [firebaseToken, setFirebaseToken] = useState('cY6eBAgwR6OgnNIdmX-LVK:APA91bFgnj4EWYKQiQ8sF41wEoJ46dwaD85VK8ls623HGMOqyJTXbbvQ_eYNPBpcSQTXRN8xgCoaIYP5LoxehwqE20R4pWikL5Geb00y1QB6FUd1PXbTAYY')
  const [thirdPartyToken, setThirdPartyToken] = useState(null)

  const generateToken = async (): Promise<any> => {
    setLoading(true)

    const formData = new FormData()
    formData.append('grant_type', 'authorization_code')
    formData.append('code', props.code)
    formData.append('client_id', props.client_id)
    formData.append('client_secret', 'UCQBnWmBExtZKpDHioFfgNOun0r6haRO8ijI8325lr2FRMNEq7MG6dVsyAW8pCHEJRdex7aLdulNYS8awvBSQ4WPR7vNlXvZ7IUeVngPQ1U6dUxhPAqhgy99qG8uDwHX')
    formData.append('code_verifier', 'ibes-application')
    formData.append('redirect_uri', decodeURIComponent(props.redirect_uri))
    formData.append('state', props.state)
    
    await request({
      method: 'post',
      urlKey: 'oauth-token',
      data: formData,
      onSuccess: setThirdPartyToken,
      onFailed: () => notification.error({ message: 'Failed to generate token' }),
    })

    setLoading(false)
  }

  const sendOtp = async () => {
    setLoading(true)

    // await generateToken()

    await request({
      method: 'post',
      urlKey: 'oauth-otp-request',
      usingSession: false,
      headers: {
        Authorization: `Bearer ${thirdPartyToken?.id_token}`,
        'Content-Type': 'multipart/form-data',
        // 'X-IDV-FBT': firebaseToken,
      },
      onSuccess: () => notification.success({ message: 'Send OTP Success' }),
      onFailed: () => notification.error({ message: 'Send OTP Failed' }),
    })

    setLoading(false)
  }

  const sendPrompt = async () => {
    setLoading(true)

    // await generateToken()

    await request({
      method: 'post',
      urlKey: 'oauth-prompt-request',
      usingSession: false,
      headers: {
        Authorization: `Bearer ${thirdPartyToken?.id_token}`,
        // 'X-IDV-FBT': firebaseToken,
      },
      onSuccess: () => notification.success({ message: 'Send Prompt Success' }),
      onFailed: () => notification.error({ message: 'Send Prompt Failed' }),
    })

    setLoading(false)
  }

  return (
    <Spin spinning={loading}>
      <Flex gap={24} justify="space-between" wrap="wrap">
        <Col flex="auto">
          {thirdPartyToken && (
            <Input
              // autoFocus
              size="large"
              addonBefore="Firebase Token"
              placeholder="Firebase Token"
              value={firebaseToken}
              onChange={e => setFirebaseToken(e.target.value)}
            />
          )}
        </Col>
        <Flex gap={12}>
          <Button size="large" shape="round" onClick={generateToken}>
            Generate Token
          </Button>
          <Button disabled={!thirdPartyToken} size="large" shape="round" onClick={sendOtp}>
            Send OTP
          </Button>
          <Button disabled={!thirdPartyToken} size="large" shape="round" onClick={sendPrompt}>
            Send Prompt
          </Button>
        </Flex>
      </Flex>
    </Spin>
  )
}