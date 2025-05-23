import { useState } from 'react';
import { Outlet } from 'react-router';
import { Layout, Spin } from 'antd';

export default function LayoutPublic() {
  const [loading, setLoading] = useState(false)

  return (
    <Spin spinning={loading}>
      <Layout style={{ height: '100vh' }}>
        <Layout.Content style={{ backgroundColor: '#f0f4f9' }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Spin>
  )
}