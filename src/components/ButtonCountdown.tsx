import { useEffect, useState } from 'react';
import { Button, ButtonProps } from 'antd';

import Countdown from './Countdown';

type PropTypes = ButtonProps & {
  disabledDuration: number;

  // children?: React.ReactNode;
  // buttonProps?: ButtonProps;
}

export default function ButtonCountdown({ disabledDuration, ...buttonProps }: PropTypes) {
  const [disabled, setDisabled] = useState(!!disabledDuration)

  useEffect(() => setDisabled(!!disabledDuration), [disabledDuration])

  return (
    <Button {...buttonProps} disabled={disabled}>
      {!disabled ? buttonProps?.children : (
        <Countdown
          duration={disabledDuration}
          onTimeout={() => setDisabled(false)}
        />
      )}
    </Button>
  )
}