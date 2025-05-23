import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { Layout, Spin } from 'antd';
import { set } from 'lodash';

import { ctx } from 'src/components';
import { lib } from 'src/utils';
import ct from 'src/constants';
// import paths from 'src/routes/paths';

export default function LayoutAuth() {
  set(window, 'lib', lib)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  console.log('searchParams', searchParams)
  
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  // --------- checking authentication ---------
  const checkAuthentication = () => {
    setLoading(true)

    // setTimeout(() => {
      const hasNextPath = location.pathname.length > 1 || location.search
      const params = hasNextPath
        ? lib.getStrParam({ next: encodeURIComponent(location.pathname + location.search) })
        : ''
      if (!lib.ls.getUserToken())
        return navigate(ct.paths.PUBLIC_SIGNIN + params)

      setAuthenticated(true)
      setLoading(false)
    // }, 2000)
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  return (
    <ctx.tfa.TwoFactorProvider>
      <Spin spinning={loading}>
        <Layout style={{ height: '100vh' }}>
          {authenticated && <Outlet />}
        </Layout>
      </Spin>
    </ctx.tfa.TwoFactorProvider>
  )
}