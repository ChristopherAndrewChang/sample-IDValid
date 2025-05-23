import { useEffect, useState } from 'react';
import moment from 'moment';

type PropTypes = {
  duration?: number;
  unit?: moment.unitOfTime.DurationConstructor;
  prefix?: string;
  strExpired?: string;
  onTimeout?: () => void;
}

export default function Countdown({
  duration = 0,
  unit = 'ms',
  prefix = '',
  strExpired = 'Expired',
  onTimeout = () => null,
}: PropTypes) {
  const [_interval, _setInterval] = useState<any>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [randomValue, setRandomValue] = useState(0)
  const [nextTime, setNextTime] = useState(moment().add(duration, unit))

  const getDiff = () =>
    moment(nextTime).diff(moment())

  const getText = (ms = 0) => {
    if (ms > 0) {
      const duration: any = moment.duration(ms)

      if (duration._data.minutes)
        return `${duration._data.minutes}m ${duration._data.seconds}s`
      else if (duration._data.seconds)
        return `${duration._data.seconds}s`
    }

    clearInterval(_interval)
    setIsExpired(true)
    onTimeout()

    return null
  }

  useEffect(() => {
    _setInterval(
      setInterval(() => setRandomValue(Math.random()), 1000)
    )

    return () => {
      clearInterval(_interval)
    }
  }, [])

  useEffect(() => setNextTime(moment().add(duration, unit)), [duration])

  console.log('Countdown duration', duration)

  return isExpired
    ? strExpired
    : `${prefix} ${getText(getDiff())}`
}