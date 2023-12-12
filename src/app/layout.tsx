'use client'
import type { Metadata } from 'next'
import StyledComponentsRegistry from '../components/Antd/AntdRegistry';

import './globals.css'
import { AuthProvider } from '@/lib/context/Auth/useAuth';


export const metadata: Metadata = {
  title: '黑洞级教务管理系统',
  description: '这是一个简易的教务管理系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  )
}
