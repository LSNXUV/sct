'use client'
//全局主题配置
import React, { KeyboardEventHandler, createContext, useContext, useEffect, useState } from 'react';
import { App, ConfigProvider, Layout, Switch, theme } from 'antd';
import { useKeyWithThing } from '@/hooks/tool';

export type Theme = 'light' | 'dark';

/**
 * 主题Context,用于在全局切换主题
 * @param CurTheme 当前主题
 * @param SwitchTheme 切换主题
 */
const ThemeContext = createContext<{
    CurTheme: Theme,
    SwitchTheme: () => void
}>({
    CurTheme: 'light',
    SwitchTheme: () => { }
});

// 主题算法
const ThemeAlgorithm = {
    light: theme.defaultAlgorithm,
    dark: theme.darkAlgorithm
};

export const ThemeProvider: RFWC = ({ children }) => {
    const [CurTheme, setCurTheme] = useState<Theme>('dark');

    useKeyWithThing('Alt+x', () => {
        SwitchTheme();
    });

    useEffect(() => {
        if(localStorage.getItem('theme')){
            setCurTheme(localStorage.getItem('theme') as Theme)
        }
    }, [])

    /**
     * 切换主题,目前只有两种主题：light和dark
     */
    const SwitchTheme = () => {
        setCurTheme(t => {
            const newTheme = t === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme); // 保存新主题到 localStorage
            return newTheme;
        });
    }


    return (
        <ThemeContext.Provider value={{ CurTheme, SwitchTheme }}
        >
            <ConfigProvider theme={{
                algorithm: ThemeAlgorithm[CurTheme],
                token:{
                    colorBgBase: CurTheme == 'dark' ? '#141414' : '#fff',
                    fontFamily:'SHSC-SB'
                }
            }}>
                <App>
                    {/* <Layout onKeyDown={onKeySwitchTheme}> */}
                        {children}
                    {/* </Layout> */}
                </App>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

// 在需要的组件中使用上下文
export const useTheme = () => useContext(ThemeContext);

