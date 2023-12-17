'use client'
import type { Metadata } from 'next'

import { useEffect } from 'react';
import './globals.css'

//全局注册
import { AuthProvider } from '@/context/Auth/Auth';
import { MessageProvider } from '@/context/Message/Message';
import StyledComponentsRegistry from '../context/Antd/AntdRegistry';

export const metadata: Metadata = {
  title: '黑洞教务管理系统',
  description: '这是一个简易的教务管理系统',
}

import React from 'react';

const ChildrenWithProviders = ({ children, providers }: {
  children: React.ReactNode,
  providers: React.ComponentType<{
    children: React.ReactNode
  }>[]
}) => {
  // 使用 reduce 方法自动包裹每个 provider
  const allProviders = providers.reduce((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);

  return <>{allProviders}</>;
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {

  }, [])
  return (
    <html lang="en">
      <body>
        <ChildrenWithProviders
          providers={[
            StyledComponentsRegistry,
            AuthProvider, MessageProvider, 
          ]}
        >
          {children}
        </ChildrenWithProviders>
      </body>
    </html>
  )
}
