'use client'

import styles from './page.module.scss'
import { useState, useEffect } from 'react';
import { Button, Input, Layout, Space } from 'antd';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Auth/Auth';
import { useTheme } from '@/context/Theme/Theme';

export default function Home() {

  const Auth = useAuth();
  const router = useRouter();
  const theme = useTheme()
  useEffect(() => {

  }
    , []);

  useEffect(() => {
    if (!Auth.isloading && !Auth.isLogin) {
      router.push('/login');
    }
  }, [Auth]);

  return (
    <Layout className={styles.container}>
      <Space>
        <Button type='primary' onClick={() => {
          Auth.logout();
        }
        }>Logout</Button>
        <Button type='default' onClick={() => {
          theme.SwitchTheme()
        }
        }>SwitchTheme</Button>
        <Input placeholder="Please Input" width={200} /></Space>
    </Layout>
  )
}
