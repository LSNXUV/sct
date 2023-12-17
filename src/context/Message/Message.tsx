
//全局provider，用于提供message组件的api

import message from 'antd/es/message';
import { createContext, useContext } from 'react';

interface MessageContextType {
    messageApi: ReturnType<typeof message.useMessage>[0]
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: RFWC = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();
    return (
        <MessageContext.Provider value={{ messageApi }}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
}

/**
 * 
 * @returns messageApi
 */
export const useMsg = () => {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context.messageApi;
}