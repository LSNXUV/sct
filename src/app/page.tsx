'use client'

import styles from './page.module.scss'
import { useState, useEffect } from 'react';
import { Button,theme} from 'antd';
import { useJwt } from '@/lib/hooks/useJwt';

import { useRouter } from 'next/navigation';

const { useToken } = theme;

export default function Home() {
  
  const { token } = useToken();

  const [jwt,setjwt] = useJwt();

  const router = useRouter();

  useEffect(() => {
    console.log(jwt);
    if (!jwt) {
      router.push('/login');
    }
  }, [router,jwt]);

  return (
    <div className={styles.container}>
      <h1>Home</h1>
    </div>
  )
}
