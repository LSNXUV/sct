'use client'

import styles from './page.module.scss'
import { useState, useEffect } from 'react';
import { Button} from 'antd';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Auth/Auth';
import { useMsg } from '@/context/Message/Message';

export default function Home() {

  const Auth = useAuth();
  const router = useRouter();

  const Message = useMsg();

  useEffect(() => {
    
  }
  ,[]);

  useEffect(() => {
    if(!Auth.isloading && !Auth.isLogin){
      router.push('/login');
    }
  }, [Auth]);

  return (
    <div className={styles.container}>
      <h1>Home</h1>
      <Button type='primary' onClick={() => {
        Auth.logout();
      }
      }>Logout</Button>
    </div>
  )
}
