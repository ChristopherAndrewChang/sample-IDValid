import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router';
import { Button, Col, Result, Row } from 'antd';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';

import { lib } from 'src/utils';

import type { ResultProps } from 'antd';

type PropTypes = ResultProps & {
  // is?: boolean;
  rawError?: any;
  onReload?: () => void;
}

const RESULT_STATUSES = {
  '403': '403',
  '404': '404',
  '500': '500',
}

export default function PageError({
  rawError,
  onReload,
  ...resultProps
}: PropTypes) {

  console.log('Rendered PageError', {rawError, onReload, ...resultProps})

  let status = 404
  let title = `Error ${status}`
  let subTitle = ''

  if (rawError?.response?.status) {
    status = rawError.response.status
    // subTitle = lib.getStrErrorMessage(rawError.response.data)

    // --------- simple error - temporary ---------
    title = rawError.code
    subTitle = rawError.message
  }

  return (
    <Result
      status={RESULT_STATUSES[status] || '404'}
      title={title}
      subTitle={subTitle}
      extra={(
        <Button type="primary" icon={<ReloadOutlined />} onClick={onReload}>
          Reload
        </Button>
      )}
      {...resultProps}
    />
  )
}