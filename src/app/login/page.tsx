'use client'
import React, { useState, useEffect } from 'react'
import styles from './login.module.scss'
import { useJwt } from '@/lib/hooks/useJwt'
import { useRouter } from 'next/navigation';
import {
  Button
} from 'antd';
import { login } from '@/lib/api/user/user';

const LoginPage = () => {

  const [jwt, setjwt] = useJwt();
  const router = useRouter();

  useEffect(() => {

    if (jwt) {
      
      console.log("已经登录了，即将跳转到首页");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  }, [jwt, router])
  return (
    <div className={styles.container}>
      <Button type='primary' onClick={() => {
        if(jwt){
          setjwt(null);
        }else{
          login('root','password').then((res)=>{
            setjwt(res.data);
          })
        }
      }
      }>Login</Button>
    </div>
  )
}

export default LoginPage