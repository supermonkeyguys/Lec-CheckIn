import { ClockCircleOutlined, CloseCircleOutlined, CommentOutlined, DoubleRightOutlined, GiftOutlined, SettingOutlined, TeamOutlined, UserOutlined, WarningOutlined } from "@ant-design/icons";
import { Menu, message, Modal } from "antd";
import { FC, useState } from "react";
import { ROUTES, } from "../../router/router";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './SideBar.module.scss'
import { getUsername, removeUsername } from "@renderer/utils/use-Token";

const SideBar: FC = () => {
    const nav = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState<boolean>(false)


    const handleLogout = () => {
        window.electronAPI?.userLogout(getUsername())
        removeUsername()
        setIsOpen(false)
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
            // if (route.key === DRAWCARD_PAGE_PATHNAME) {
            //     message.info('火速开发中')
            //     return
            // }
            if (route.key === 'logout') {
                // handleLogout()
                setIsOpen(true)
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

    const ModalElem = (
        <Modal
            closeIcon={<CloseCircleOutlined style={{ color: 'red' }} />}
            title={(
                <>
                    <WarningOutlined style={{ color: "orange", marginRight: '6px', fontSize: '20px' }} />
                    <span>确认是否退出</span>
                </>
            )}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            cancelText="取消"
            onOk={handleLogout}
            okText="确认"
        />
    )

    return (
        <div className={styles.sideBarContainer}>
            {isOpen && ModalElem}
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