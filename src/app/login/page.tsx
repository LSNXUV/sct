'use client'
import React, { useState, useEffect, useContext } from 'react'
import styles from './login.module.scss'
import {
  Button
} from 'antd';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Auth/Auth';
import { useMsg } from '@/context/Message/Message';

const LoginPage = () => {
  const Auth = useAuth();
  const router = useRouter();
  const Message = useMsg();

  useEffect(() => {
    // console.log('login init')
  }, [])

  useEffect(() => {
    if(Auth.isLogin){
      router.push('/')
    }
  }, [Auth]);

  return (
    <div className={styles.container}>
      <Button type='primary' onClick={() => {
         Auth.login('root','password').then(() => {
        });
      }
      }>Login</Button>
    </div>
  )
}

export default LoginPage