import moment from "moment";
import { useEffect, useRef } from "react";
import { lib, request } from "src/utils";

type RequestDataType = {
  challenge: string;
  id: string;
  valid_until: string;
}

type PropTypes = {
  state: string;
  requestData: RequestDataType;
  onAnswered: (data?) => void;
}

export default function MobileChallengeCode(props: PropTypes) {
  const _interval = useRef(null)

  const checkAnswer = () => {
    if (moment(props.requestData.valid_until).diff(moment()) <= 0) {
      clearInterval(_interval.current)
      props.onAnswered(null)
    }

    // 404 -> not answered, no request with the ID
    // 200 -> accepted
    // 204 -> rejected
    const { headers } = lib.getEncryptedData()
    request({
      method: 'post',
      urlKey: 'auth-multi-factors-mobile-detail',
      args: [props.requestData.id],
      headers,
      data: { state: props.state },
      onSuccess: (res) => {
        clearInterval(_interval.current)
        // lib.ls.assignUserToken(res)
        props.onAnswered(res)
      },
    })
  }

  useEffect(() => {
    _interval.current = setInterval(checkAnswer, 4000)

    return () => {
      clearInterval(_interval.current)
    }
  }, [])

  return (
    <div style={{ fontSize: '32px', textAlign: 'center' }}>
      {props.requestData.challenge}
    </div>
  )
}