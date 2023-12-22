'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import User from '@/lib/api/user/user';
import { usePathname, useRouter } from 'next/navigation';
import { App } from 'antd';
import BalldanceLoading from '@/components/Balldance/balldance';
import { useTheme } from '../Theme/Theme';
import { ResponseData } from '@/lib/types/Response';
import { MessageInstance } from 'antd/lib/message/interface';

// 定义用户信息和JWT的类型
interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLogin: boolean;
  isloading: boolean;
  resCall:(res:ResponseData,callback?:()=>void)=>void;
  validateJwt: () => boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

// 创建Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 使用JWT从localStorage中获取用户信息
const getUserFromJWT = (token: string): User | null => {
  return token ? jwtDecode<User>(token) : null;
};

// AuthProvider组件
export const AuthProvider: RFWC = ({ children }) => {

  const theme = useTheme()
  const { message } = App.useApp()
  const router = useRouter();
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false)
  const [isloading, setIsloading] = useState(true)
  const [jwt, setJwt] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(getUserFromJWT(jwt || ''));

  //注册方法
  const register = async (username: string, password: string, name: string) => {
    const res = await User.register(username, password, name);
    if (res.code !== 0) {
      message.error(res.msg);
    } else {
      message.success(res.msg);
    }
  }

  //本地验证jwt是否过期,如果过期,返回false
  const validateJwt = () => {
    if (!jwt) return false;
    const exp = jwtDecode<{ exp: number }>(jwt).exp;
    const now = Math.floor(Date.now() / 1000);
    if (now > exp) {
      return false;
    }
    return true;
  }

  /**
   * 用于处理请求返回的数据,如果code不为0,则提示错误信息,如果code为0,则提示成功信息
   * 自动判断是否登录过期,如果过期,则提示登录过期,并且跳转到登录页面
   * @param res 请求返回的数据
   * @param callback 请求成功后的回调函数
   */
  const resCall = (res:ResponseData,callback:()=>void = () => {}) => {
    if(!validateJwt() || res.code === -1){
      message.destroy()
      message.error('登录过期,请重新登录')
      logout()
      return
    }
    if(res.code !== 0){
      message.destroy()
      message.error(res.msg)
      return
    }
    message.destroy()
    message.success(res.msg)
    callback()
  }

  // 登录方法
  const login = async (username: string, password: string) => {
    setIsloading(true)
    const res = await User.login(username, password);
    if (res.code !== 0) {
      message.error(res.msg);
      setIsloading(false)
      return;
    }
    const jwt = res.data;
    localStorage.setItem('sk', jwt);
    setJwt(jwt);
    setIsLogin(true);
    setUser(getUserFromJWT(jwt));

    //跳转路由等等
    message.destroy();
    message.success(res.msg);

    setIsloading(false)
  }

  // 登出方法
  const logout = () => {
    setIsloading(true)
    localStorage.removeItem('sk');
    setJwt(null);
    setIsLogin(false);
    setUser(null);
    // setIsloading(true)
    
    setIsloading(false)
    message.success('已退出登录');
  };

  useEffect(() => {
    const jwt = localStorage.getItem('sk');
    if (jwt) {
      setJwt(jwt);
      setIsLogin(true);
      setUser(getUserFromJWT(jwt));
    }

    setIsloading(false);
  }, []);

  //路由守卫,如果没有登录,跳转到登录页面
  useEffect(() => {
    // console.log('loading changeeeeeeeeeeeeeeeee!')
    if (isloading) {
      // console.log('Auth isloading')
    } else {
      // console.log('Auth isloading完毕')
      if (isLogin) {
        // console.log('Auth 已登录')
        if (pathname === '/login') {
          // console.log('Auth 跳转 back');
          router.back();
        } else {
          // console.log('路由正常')
        }
      } else {
        // console.log('Auth 未登录')
        if (pathname !== '/login') {
          // console.log('Auth 跳转 login');
          router.push('/login');
        } else {
          // console.log('路由正常')
        }
      }
    }

  }, [isloading, isLogin, pathname,router]);


  return (
    <AuthContext.Provider value={{ user, isLogin, isloading,resCall, validateJwt, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook来使用AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
