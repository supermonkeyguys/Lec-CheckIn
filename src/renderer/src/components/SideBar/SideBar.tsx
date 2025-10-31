import { ClockCircleOutlined, CommentOutlined, DoubleRightOutlined, GiftOutlined, SettingOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, message } from "antd";
import { FC } from "react";
import { DRAWCARD_PAGE_PATHNAME, ROUTES, } from "../../router/router";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './SideBar.module.scss'
import { getUsername, removeUsername } from "@renderer/utils/use-Token";

const SideBar: FC = () => {
    const nav = useNavigate()
    const location = useLocation()
    const handleLogout = () => {
        window.electronAPI?.userLogout(getUsername())
        removeUsername()
        window.electronAPI?.removeWindow('/clock/clockIn')
        window.electronAPI?.openWindow('/home')
    }


    const menuItems = [
        {
            label: '打卡',
            icon: <ClockCircleOutlined />,
            key: ROUTES.CLOCKIN,
        },
        {
            label: '抽卡',
            icon: <GiftOutlined />,
            key: ROUTES.DRAWCARD,
        },
        {
            label: "个人中心",
            icon: <UserOutlined />,
            key: ROUTES.PROFILE,
        },
        {
            label: "团队成员",
            icon: <TeamOutlined />,
            key: ROUTES.TEAMMEMBER,
        },
        {
            label: '聊天大厅',
            icon: <CommentOutlined />,
            key: ROUTES.MEETING
        },
        {
            label: '设置',
            icon: <SettingOutlined />,
            key: ROUTES.SETTING
        },
        { 
            label: '退出',
            icon: <DoubleRightOutlined />,
            key: 'logout'
        }
    ]

    const handleOnChange = ({ key }: { key: string }) => {
        const route = menuItems.find(m => m!.key === key)

        if (route) {
            if (route.key === DRAWCARD_PAGE_PATHNAME) {
                message.info('火速开发中')
                return
            }
            else if(route.key === 'logout') {
                handleLogout()
                return 
            }
            nav(route.key)
        }
        else {
            message.error('跳转失败')
        }
    }

    const getSelectedKey = () => {
        const currentRoute = menuItems.find(m => location.pathname.startsWith(m.key))
        return currentRoute ? currentRoute.key : ROUTES.CLOCKIN
    }

    return (
        <div className={styles.sideBarContainer}>
            <Menu
                mode='inline'
                items={menuItems}
                selectedKeys={[getSelectedKey()]}
                onClick={handleOnChange}
                className={styles.sideBarMenu}
            />
        </div>
    )
}

export default SideBar