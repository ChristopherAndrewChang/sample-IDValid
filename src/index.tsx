import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router';
import { App as AntdApp, ConfigProvider } from 'antd'

// import App from './App';
import reportWebVitals from './reportWebVitals';
import Routes from 'src/routes';

import './index.css';
import './app.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ConfigProvider theme={{ cssVar: true }}>
    <AntdApp>
      <Routes />
    </AntdApp>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
