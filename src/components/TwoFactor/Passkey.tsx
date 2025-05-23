import { App, Button, Card, Col, Row } from 'antd';
import Icon from '@ant-design/icons';

import { lib } from 'src/utils';
import PasskeyIcon from './PasskeyIcon';

type PropTypes = {
  setLoading: (loading: boolean) => void;
  onClose: (success: boolean) => void;
}

export default function TwoFactorPasskey(props: PropTypes) {
  const { notification } = App.useApp()

  const verifyPasskey = async () => {
    props.setLoading(true)

    lib.passkey.verify()
      .then(token => {
        lib.ls.assignUserToken(token)
        props.onClose(true)
      })
      .catch(e => {
        console.error('Failed register passkey : ', e.toString())
        notification.error({ message: e.toString() })
      })
      .finally(() => props.setLoading(false))
  }

  return (
    <div>
      <Card>
        <Row align="middle" style={{ flexDirection: 'column' }}>
          <PasskeyIcon />
          <div style={{ fontSize: '21px', fontWeight: 500, marginTop: '6px' }}>
            Passkey
          </div>
        </Row>
        <div style={{ marginTop: '12px' }}>
          When you are ready, authenticate using the button below.
        </div>
        <Button block type="primary" style={{ marginTop: '12px' }} onClick={verifyPasskey}>
          Use passkey
        </Button>
      </Card>
    </div>
  )
}