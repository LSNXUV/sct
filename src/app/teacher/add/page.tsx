'use client'
import { FLayout } from '@/components/Layout/Layout'
import CusMenu from '@/components/Menu/Menu'
import {
    App,
    Button,
    Card,
    Form, Input, InputNumber, Radio, Select, Space, 
} from 'antd'
const { Option } = Select
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import React from 'react'
import type { TeacherType } from '@/lib/api/teacher/teacher'
import Teacher from '@/lib/api/teacher/teacher'

/*
 type TeacherType ={
    id:string;
    department:string;
    name:string;
    age:number;
    gender:string;
    phone:string;
    email:string;
}
 */

const phonePrefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select style={{ width: 70 }} >
            <Option value="+86">+86</Option>
            <Option value="+87">+87</Option>
        </Select>
    </Form.Item>
);

const emailSuffixSelector = (
    <Form.Item name="suffix" noStyle>
        <Select style={{ width: 200 }} >
            <Option value="@gmail.com">@gmail.com</Option>
            <Option value="@ctbu.edu.cn">@ctbu.edu.cn</Option>
            <Option value="@163.com">@163.com</Option>
            <Option value="@qq.com">@qq.com</Option>
            <Option value="@outlook.com">@outlook.com</Option>
            <Option value="@icloud.com">@icloud.com</Option>
        </Select>
    </Form.Item>
);

const AddComponent = () => {
    const [form] = Form.useForm();
    const {message} = App.useApp()
    const onFinish =async (values: TeacherType &{
        prefix: string;
        suffix: string;
    }) => {
        
        values.email = values.email + values.suffix
        // values.phone = values.prefix + values.phone
        const res = await Teacher.save(values)
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
            <Card hoverable title={<Title level={2}>添加教师</Title>}
                style={{
                    width: '600px',
                    padding: 24,
                    margin: 'auto',
                    marginTop: '3%'
                }}
            >
                <Form 
                    form={form}
                    name="addStudent"
                    onFinish={onFinish}
                    {...formItemLayout}
                    initialValues={{ size: 'default', prefix: '86', suffix: '@ctbu.edu.cn' }}
                    size={'large'}
                >
                    <Form.Item<TeacherType> label="姓名" name={"name"}
                        rules={[
                            {
                                required: true,
                                message: '请输入姓名!',
                            },
                        ]}
                    >
                        <Input style={{
                                width: '50%'
                            }}/>
                    </Form.Item>
                    <Form.Item<TeacherType> label="学号" name={"id"}
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
                    <Form.Item<TeacherType> label="年龄" name={"age"}
                        rules={[
                            {
                                type: 'number',
                                message: '请输入数字',
                            },
                            {
                                required: true,
                                message: 'age不能为空!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item<TeacherType> label="性别" name={"gender"}
                        rules={[
                            {
                                required: true,
                                message: '请选择性别!',
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="男">男</Radio>
                            <Radio value="女">女</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item<TeacherType> label="部门" name={"department"}
                        rules={[
                            {
                                required: true,
                                message: '请输入部门!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<TeacherType> label="电话" name={"phone"}
                        rules={[
                            {
                                required: true,
                                message: '请输入电话号码!',
                            },
                        ]}
                    >
                        <Input addonBefore={phonePrefixSelector} style={{
                                width: '55%'
                            }}/>
                    </Form.Item>
                    <Form.Item<TeacherType> label="邮箱" name={"email"}
                        rules={[
                            {
                                required: true,
                                message: '请输入邮箱!',
                            },
                        ]}
                    >
                        <Input addonAfter={emailSuffixSelector} />
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
            <CusMenu SelectKey='52' OpenSubKey={['5']} />
            <AddComponent />
        </FLayout>
    )
}

export default AddPage