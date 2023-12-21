'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import {
    App,
    Button,
    Card,
    Form, Input, InputNumber, Radio, Select,  Space, 
} from 'antd'
const { Option } = Select
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React from 'react'
import type { CourseType } from '@/lib/api/course/course'
import Course from '@/lib/api/course/course'

/*
 type CourseType = {
    id: string;
    name: string;
    credit: number;
    hours: number;
}
 */



const AddComponent = () => {
    const [form] = Form.useForm();
    const {message} = App.useApp()
    const onFinish =async (values: CourseType) => {
        
        const res = await Course.save(values)
        if(res.code === 0){
            message.success('添加成功')
            return
        }
        message.error(res.msg)
    };
    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };

    const submit = () => {
        form.submit()
    }

    return (
        <Content
            style={{
                padding: 24,
            }}
        >
            <Card hoverable title={<Title level={2}>添加课程</Title>}
                style={{
                    width: '600px',
                    padding: 24,
                    margin: 'auto',
                    marginTop: '3%'
                }}
            >
                <Form 
                    form={form}
                    name="addCourse"
                    onFinish={onFinish}
                    {...formItemLayout}
                    initialValues={{ size: 'default'}}
                    size={'large'}
                >
                    <Form.Item<CourseType> label="课号" name={"id"}
                        rules={[
                            {
                                type: 'number',
                                message: '请输入数字',
                            },
                            {
                                required: true,
                                message: 'id不能为空!',
                            },
                        ]}
                    >
                        <InputNumber style={{
                                width: '35%'
                            }}/>
                    </Form.Item>
                    <Form.Item<CourseType> label="课程名" name={"name"}
                        rules={[
                            {
                                required: true,
                                message: '请输入课程名!',
                            },
                        ]}
                    >
                        <Input style={{
                                width: '50%'
                            }}/>
                    </Form.Item>
                    <Form.Item<CourseType> label="学分" name={"credit"}
                        rules={[
                            {
                                type: 'number',
                                message: '请输入数字',
                            },
                            {
                                required: true,
                                message: 'credit不能为空!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item<CourseType> label="学时" name={"hours"}
                        rules={[
                            {
                                type: 'number',
                                message: '请输入数字',
                            },
                            {
                                required: true,
                                message: 'hours不能为空!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit" >
                            提交
                        </Button>
                        <Button type="default" onClick={() => {
                            form.resetFields()
                        }}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>
                </Form>
            </Card>
        </Content>
    )
}

function AddPage() {
    return (
        <FLayout>
            <CusMenu SelectKey='32' OpenSubKey={['3']} />
            <AddComponent />
        </FLayout>
    )
}

export default AddPage