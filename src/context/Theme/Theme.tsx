
//全局主题配置
import React, { createContext, useContext, useState } from 'react';
import { App, ConfigProvider, Layout, Switch, theme } from 'antd';

type Theme = 'light' | 'dark';

/**
 * 主题Context,用于在全局切换主题
 * @param CurTheme 当前主题
 * @param SwitchTheme 切换主题
 */
const ThemeContext = createContext({
    CurTheme: 'light',
    SwitchTheme: () => { }
});

// 主题算法
const ThemeAlgorithm = {
    light: theme.defaultAlgorithm,
    dark: theme.darkAlgorithm
};

export const ThemeProvider: RFWC = ({ children }) => {
    const [CurTheme, setCurTheme] = useState<Theme>('light');

    /**
     * 切换主题,目前只有两种主题：light和dark
     */
    const SwitchTheme = () => {
        setCurTheme(t => t === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{ CurTheme, SwitchTheme }}>
            <ConfigProvider theme={{
                algorithm: ThemeAlgorithm[CurTheme],
            }}>
                <App>
                    <Layout>
                        {children}
                    </Layout>
                </App>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

// 在需要的组件中使用上下文
export const useTheme = () => useContext(ThemeContext);

