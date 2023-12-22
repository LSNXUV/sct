
import {
    Menu, Layout, Image, Modal, ConfigProvider
} from 'antd';
import type { MenuProps, MenuTheme } from 'antd/es/menu';
const { Sider } = Layout
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import {
    UnorderedListOutlined,
    HomeOutlined,
    LogoutOutlined,
    LeftCircleOutlined,
    UserOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useAuth } from '@/context/Auth/Auth';


type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

function getSubItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
): MenuItem {
    return {
        key,
        icon,
        label,
    } as MenuItem;
}

const RouterEnum = {
    '1': '/',
    '21': '/student',
    '22': '/student/add',
    '31': '/course',
    '32': '/course/add',
    '51': '/teacher',
    '52': '/teacher/add',
    '6': '/grade',
    '9': '/login'
}

const items = [

    getItem("首页", "1", <HomeOutlined />,),
    getItem("学生管理", "2", <UserOutlined />, [
        getItem('学生概况', '21'),
        getItem('添加学生', '22'),
    ]),
    getItem("课程管理", "3", <UnorderedListOutlined />, [
        getItem('课程概览', '31'),
        getItem('添加课程', '32'),
    ]),

    getItem("成绩管理", "6", <LeftCircleOutlined />),
    getItem("教师管理", "5", <UserOutlined />, [
        getItem('教师概况', '51'),
        getItem('添加教师', '52'),
    ]),

    
    getItem("退出登录", "9", <LogoutOutlined />),

]

const CusMenu = ({ SelectKey, OpenSubKey }: {
    SelectKey: string,
    OpenSubKey: string[]
}) => {

    const router = useRouter();
    const Auth = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    // 在组件内部定义一个状态来控制确认框的显示与隐藏
    const [LogoutModal, setLogoutModal] = useState(false);

    // 定义一个函数来处理确认框中点击确定按钮的事件
    const ConfirmLogout = () => {

        Auth.logout()
        // 关闭确认框
        setLogoutModal(false)
    }

    return (
        <Sider theme='light'
            style={{
                overflow: 'hidden',
                fontFamily: 'SHSC-SB'
            }}
            collapsed={collapsed}
            onMouseEnter={() => {
                setCollapsed(false)
            }}
            onMouseLeave={() => {
                setCollapsed(true)
            }}
        >
            <Image
                style={{ margin: 3 }}
                width={70} alt={'Next'} preview={false} src={'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'} />

            <Menu
                style={{
                    // marginTop: '0vh' 
                }}
                onClick={({ key }: {
                    key: string
                }) => {

                    //退出登录
                    if (key == '9') {
                        setLogoutModal(true)
                        return
                    }

                    router.push(RouterEnum[key as keyof typeof RouterEnum])
                }}
                defaultSelectedKeys={[SelectKey ?? ""]}
                defaultOpenKeys={OpenSubKey ?? []}
                mode="inline"
                theme="light"
                items={items}
            />
            {
                <Modal
                    title="确认退出登录"
                    open={LogoutModal}
                    centered
                    onOk={ConfirmLogout}
                    onCancel={() => {
                        setLogoutModal(false)
                    }}
                    okText={'确定'}
                    cancelText={'取消'}

                >
                    <p>确定要退出登录吗？</p>
                </Modal>
            }
        </Sider>
    );
};

export default CusMenu;
