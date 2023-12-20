// 'use client'
import type { Metadata } from 'next'

import { useEffect } from 'react';
import './globals.css'

//全局注册
import { AuthProvider } from '@/context/Auth/Auth';
import StyledComponentsRegistry from '../context/Antd/AntdRegistry';

export const metadata: Metadata = {
  title: '黑洞教务管理系统',
  description: '这是一个简易的教务管理系统',
}

import React from 'react';
import { App, ConfigProvider } from 'antd';
import { ThemeProvider } from '@/context/Theme/Theme';

/**
 * 将多个 provider 包裹在一起，包裹层级顺序与数组顺序一致。
 * 例如，providers 数组中的第一个元素将是最外层的包装器。
 * 
 * @param children - React 节点，将被所有 providers 包裹。
 * @param providers - 包含 React 组件的数组，这些组件将作为 providers 使用。
 * @returns 返回一个包含所有 providers 的组件。
 */
const ChildrenWithProviders: React.FC<{
  children: React.ReactNode,
  providers: React.ComponentType<{
    children: React.ReactNode
  }>[]
}> = ({ children, providers }) => {
  const allProviders = providers.reduceRight((acc, Provider) => (
    <Provider>{acc}</Provider>
  ), children);

  return <>{allProviders}</>;
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body>
        <ChildrenWithProviders
          providers={[
            StyledComponentsRegistry, //antd首屏样式按需加载
            ThemeProvider, //主题、消费组件、layout等等
            AuthProvider, //用户认证
          ]}
        >
          {children}
        </ChildrenWithProviders>
      </body>
    </html>
  )
}
