'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import Student from '@/lib/api/student/student'
import { App, Button, Popover, Table } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React, { useEffect, useState } from 'react'
import type { StudentType, StudentPageType } from '@/lib/api/student/student'
import { useRequest } from 'ahooks'
import { ColumnsType } from 'antd/es/table'

/**
 * type StudentType = {
    id:string,
    major:string,
    name:string,
    age:number,
    gender:string,
    phone:string,
    email:string
}
 */
const columns: ColumnsType<StudentType> = [
    {
        title: '学号',
        dataIndex: 'id',
    },
    {
        title: '姓名',
        dataIndex: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
    },
    {
        title: '性别',
        dataIndex: 'gender'
    },
    {
        title: '专业',
        dataIndex: 'major'
    },
    {
        title: '手机号',
        dataIndex: 'phone'
    },
    {
        title: '邮箱',
        dataIndex: 'email'
    }
]

function Students() {
    const { message } = App.useApp()
    const [Students, setStudents] = useState<StudentPageType>({} as StudentPageType)

    const { data: getStudentsData, loading: loadingStudents, run: getStudents } = useRequest(
        () => Student.getAll(2, 1),
        {
            manual: true,
            throttleWait: 500,
            onSuccess: (res) => {
                if (res.code === 0) {
                    message.success('获取成功')
                    setStudents(res.data)
                }
            },
            onError: (error) => {
                message.error('获取失败')
                console.error(error)
            }
        }
    )

    useEffect(() => {
        getStudents()

    }, [getStudents])


    return (
        <Content style={{
            padding: '50px 24px',
        }}>
            <Popover content={'点击刷新'} placement='top'>
                <Title level={1}
                    style={{
                        width:'10rem',
                        marginBottom: '2%',
                        cursor: 'pointer'

                    }}
                    onClick={() => {
                     getStudents()
                    }}
                >
                    学生概况
                </Title>
            </Popover>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(selectedRowKeys, selectedRows)
                    }
                }}
                loading={loadingStudents}
                dataSource={Students.content?.map((item) => {
                    return {
                        ...item,
                        key: item.id
                    }
                })}
                columns={columns}
            />

        </Content>
    )
}

function StudentPage() {
    return (
        <FLayout>
            <CusMenu OpenSubKey={['2']} SelectKey='21' />
            <Students />
        </FLayout>
    )
}

export default StudentPage