import { useJwt } from "@/lib/hooks/useJwt";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义Context的类型
interface AuthContextType {
    isLoggedIn: boolean;
    setJwt: (jwt: string | null) => void;
}

// 创建Context对象
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider的props类型
interface AuthProviderProps {
    children: ReactNode;
}

// 提供AuthContext的Provider组件
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [jwt, setJwt] = useJwt(); // 使用你的自定义hook
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        setIsLoggedIn(!!jwt); // 如果jwt存在，则设置为已登录
    }, [jwt]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setJwt }}>
            {children}
        </AuthContext.Provider>
    );
};

// 自定义hook，用于在组件中访问登录状态和setJwt
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
