'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React from 'react'


function Student(){
    return (
        <Content style={{
            padding: '50px 24px',
        }}>
            <Title level={1}>
                学生概况
            </Title>
        </Content>
    )
}

function StudentPage() {
  return (
    <FLayout>
        <CusMenu OpenSubKey={['2']} SelectKey='21'/>
        <Student/>
    </FLayout>
  )
}

export default StudentPage