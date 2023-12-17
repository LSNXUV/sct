import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import User from '@/lib/api/user/user';
import { useRouter } from 'next/navigation';
import { App } from 'antd';

// 定义用户信息和JWT的类型
interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLogin: boolean;
  isloading: boolean;
  validateJwt: () => boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string,name:string) => Promise<void>;
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

  // const message = useMsg();
  const {message} = App.useApp()
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false)
  const [isloading, setIsloading] = useState(true)
  const [jwt, setJwt] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(getUserFromJWT(jwt || ''));

  //注册方法
  const register = async (username:string,password:string,name:string) => {
    const res = await User.register(username, password, name);
    if(res.code !== 0){
      message.error(res.msg);
    }else{
      message.success(res.msg);
    }
  }

  //本地验证jwt是否过期
  const validateJwt = () => {
    if(!jwt) return false;
    const exp = jwtDecode<{exp:number}>(jwt).exp;
    const now = Math.floor(Date.now() / 1000);
    if(now > exp){
      return false;
    }
    return true;
  }

  // 登录方法
  const login = async (username:string,password:string) => {
    setIsloading(true)
    const res = await User.login(username, password);
    if(res.code !== 0){
      message.error(res.msg);
      return;
    }
    const jwt = res.data;
    localStorage.setItem('sk', jwt);
    setJwt(jwt);
    setIsLogin(true);
    setUser(getUserFromJWT(jwt));

    // setIsloading(false)
    //跳转路由等等
    message.success(res.msg);
    
    setIsloading(false)
    router.back()
  }

  // 登出方法
  const logout = () => {
    setIsloading(true)
    localStorage.removeItem('sk');
    setJwt(null);
    setIsLogin(false);
    setUser(null);
    // setIsloading(true)
    message.success('已退出登录');
    setIsloading(false)
    router.push('/login');
  };

  useEffect(() => {
    const jwt = localStorage.getItem('sk');
    if(jwt){
      setJwt(jwt);
      setIsLogin(true);
      setUser(getUserFromJWT(jwt));
    }

    setIsloading(false);
  }, []);

/*   useEffect(() => {
    console.log('Auth change',user,isLogin,jwt);
  }, [user,isLogin,jwt]); */

  return (
    <AuthContext.Provider value={{ user, isLogin,isloading,validateJwt,login,register, logout }}>
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
