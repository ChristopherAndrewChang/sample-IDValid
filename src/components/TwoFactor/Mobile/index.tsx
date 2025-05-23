import { useRef, useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import Icon, { CodeOutlined, MobileOutlined, WarningOutlined } from '@ant-design/icons';

import MobileChallengeCode from './Code';
import { ctx } from 'src/components';
import { lib, request } from 'src/utils';

import type { VERIFY_2FA_CONTENT_PROPS } from '../propTypes';

export default function TwoFactorPin(props: VERIFY_2FA_CONTENT_PROPS) {
  const _form = useRef<any>(null)
  const _state = useRef(null)

  const { notifError } = ctx.useNotif()

  const [isError, setIsError] = useState(false)
  const [requestData, setRequestData] = useState(null)

  const getConvertedState = async (input: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
  
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const base64 = btoa(String.fromCharCode(...hashArray))
  
    return base64
  }

  const sendRequest = async () => {
    props.setLoading(true)

    _state.current = 'a' // lib.generateState()
    const convertedState = await getConvertedState(_state.current)

    const { headers } = lib.getEncryptedData()
    request({
      method: 'post',
      urlKey: 'auth-multi-factors-mobile',
      headers,
      data: { state: convertedState },
      onSuccess: (res) => {
        setIsError(false)
        setRequestData(res)
      },
      onFailed: (error, _, rawError) => {
        notifError(rawError)
        setIsError(true)
      },
      onBoth: () => props.setLoading(false),
    })
  }

  return (
    <div>
      {isError && (
        <Alert
          showIcon
          type="error"
          icon={<WarningOutlined />}
          message="Verification request failed."
          style={{ marginBottom: '12px' }}
        />
      )}
      <Card>
        <Row align="middle" style={{ flexDirection: 'column' }}>
          <MobileOutlined style={{ fontSize: '48px' }} />
          <div style={{ fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
            IDValid Mobile
          </div>
          <div style={{ marginTop: '12px' }}>
            {isError
              ? 'We could not verify your identity'
              : requestData
                ? 'When sent you a verification request on your IDValid Mobile app. Enter the digits shown below to enter sudo mode.'
                : 'Send verification request to mobile app using the button below.'}
          </div>
        </Row>
        <div style={{ marginTop: '12px' }}>
          {(isError || !requestData) ? (
            <Button block type="primary" onClick={sendRequest}>
              {isError ? 'Retry' : 'Send Request'}
            </Button>
          ) : (
            <MobileChallengeCode
              state={_state.current}
              requestData={requestData}
              onAnswered={res => {
                console.log('onAnswered', res)
                setIsError(!res)
                if (res) {
                  props.onClose(true, res)
                }
              }}
            />
          )}
        </div>
      </Card>
    </div>
  )
}