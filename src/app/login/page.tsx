'use client'
import React, { useState, useEffect} from 'react'
import styles from './login.module.scss'
import {
  Button, Image, Form, Input,
  Row, Col, Space, Typography, Card, ConfigProvider, App, Popover
} from 'antd';

const { Title } = Typography
import Link from 'next/link'

import { useAuth } from '@/context/Auth/Auth';
import axios from 'axios';
import { useTheme } from '@/context/Theme/Theme';
import BalldanceLoading from '@/components/Balldance/balldance';
import { useRequest } from 'ahooks';
import { CLayout } from '@/components/Layout/Layout';

const Login = ({ }) => {
  const Auth = useAuth()
  const Theme = useTheme()

  const [vcodePic, setvcodePic] = useState('')
  const [vcodeId, setvcodeId] = useState('')
  const { message } = App.useApp()

  const { loading: VcodeLoading, run: RefreshVcode } = useRequest(
    () => axios.get(
      'https://v2.api-m.com/api/captcha?type=math&width=120&height=40',
      {
        timeout: 4000,

      }
    ),
    {
      onSuccess: (res) => {
        if (res.data?.code === 200) {
          setvcodePic(res.data.data.url)
          setvcodeId(res.data.data.id)
        }
      },
      onError: (error) => {
        message.error('刷新失败!')
        console.error(error);
      },
      refreshDeps: [setvcodePic, setvcodeId, message],
      throttleWait: 1000,
      manual: true,
    }
  )

  const onFinish = async ({ username, password, vcode }: {
    username: string,
    password: string,
    vcode: string
  }) => {
    message.loading('正在登录...')
    //验证二维码
    try {
      const res = await axios.get(
        `https://v2.api-m.com/api/captcha?id=${vcodeId}&key=${vcode}`,
        {
          timeout: 4000
        }
      )

      if (res.data?.code != 200) {
        RefreshVcode()
        message.destroy()
        return message.error(res.data?.msg)
      }

    } catch (error) {
      console.error(error);
      return message.open({
        type: 'error',
        content: '验证请求出错!',
      })
    }
    message.destroy()
    await Auth.login(username, password)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }

  useEffect(() => {
    RefreshVcode()
    let timer = setInterval(() => {
      RefreshVcode()
      console.log('60秒自动刷新验证码');
    }, 60000)
    return () => {
      clearInterval(timer)
    }
  }, [RefreshVcode])

  return (
    <ConfigProvider
      theme={{
        token: {
        },
        // algorithm: theme.defaultAlgorithm,
        components: {
          Card: {
          }
        }
      }}
    >
      <Card
        hoverable
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '520px',
          margin: 'auto',
          zIndex: '1',
          boxShadow: '0 5px 17px 0 rgba(0, 0, 0, 0.4)'
        }}
      >
        <Title
          style={{
            textAlign: 'center', marginBottom: '3vh', fontFamily: '宋体', fontWeight: 'bold'
          }} level={3}>登录</Title>
        <Form
          name="login"
          style={{
            minWidth: '20vw',
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout='vertical'
          autoComplete="off"
          size='middle'
        >

          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: '用户名不能为空!',
              },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '密码不能为空!',
              },
            ]}
          >
            <Input.Password width={'80%'} />
          </Form.Item>


          <Form.Item label="验证码">
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="vcode"
                  rules={[{
                    required: true,
                    message: '请输入验证码!'
                  }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Popover content={'点击刷新验证码'} >
                <Col span={8}>
                  <Image preview={false} src={vcodePic} width={'100%'}
                    style={{
                      backgroundColor: Theme.CurTheme == 'dark' ? '#eee' : 'transparent',
                      borderRadius: '5px',
                      marginTop: '-4%'
                    }}
                    onClick={() => {
                      RefreshVcode()
                      message.success('刷新成功')
                    }}
                    alt="验证码" />

                </Col></Popover>
            </Row>
          </Form.Item>


          <Form.Item>
            <Space size={240}>
              <Button type="primary" shape="round" size='large' htmlType="submit">
                登录
              </Button>
              <Link className="login-form-forgot" href={''}
                onClick={() => {
                  message.open({
                    type: 'info',
                    content: '请联系管理员',
                  })
                }}>
                忘记密码?
              </Link>
            </Space>
          </Form.Item>

        </Form>
      </Card>

    </ConfigProvider>
  )

}



const LoginPage = () => {
  const Auth = useAuth();

  //如果登录初始化完毕且未登录,才显示登录页面
  if (!(!Auth.isloading && !Auth.isLogin)) {
    return <BalldanceLoading />
  }
  return (
    <CLayout>
      <Login />
    </CLayout>
  )
}

export default LoginPage