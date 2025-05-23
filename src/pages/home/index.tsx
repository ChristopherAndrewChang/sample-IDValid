import { useState } from 'react';
import { Link, NavLink, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router';
import { Button, Card, Col, Flex, Input, Row, Spin, Tag, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

import appConfig from 'src/config/app';
import { lib } from 'src/utils';
import ct from 'src/constants';
import TestTwoFactor from 'src/components/TwoFactor';

import logo from 'src/assets/images/logo.png';

export default function Home(props) {
  const navigate = useNavigate()
  const outletContext = useOutletContext()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  console.log('Home', {props, outletContext, params, searchParams})

  const [input, setInput] = useState('')
  const [hasil, setHasil] = useState('')

  const convert = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
  
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64 = btoa(String.fromCharCode(...hashArray));
  
    setHasil(base64);
  }

  return (
    <div style={{ padding: '12px' }}>
      <Link to="/test">
        Test
      </Link>
      <Input
        autoFocus
        value={input}
        onChange={e => setInput(e.target.value)}
        onPressEnter={convert}
      />
      <Button onClick={convert}>
        Test
      </Button>
      <div>
        Hasil : {hasil}
      </div>
    </div>
  )
}