import { FC } from "react";
import SideBar from "../components/SideBar/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import styles from './ManageLayout.module.scss'
import { Button } from "antd";
import { removeToken } from "@renderer/utils/use-Token";
import TitleBar from "@renderer/components/TitleBar/TitleBar";
import { useSetting } from "@renderer/hooks/useSetting";

const ManageLayout: FC = () => {
    const { backgroundType } = useSetting()
    const isNone = backgroundType === 'none'

    const handleLogout = () => {
        removeToken()
        window.electronAPI?.openWindow('/')
        window.electronAPI?.removeWindow('/clock/clockIn')
    }

    return (
        <div className={`${styles.layoutContainer} ${false ? '' : styles.specBackground}`}>
            <div>
                <TitleBar />
            </div>
            <SideBar />
            <div className={styles.outletContainer}>
                <Button
                    onClick={handleLogout}
                >
                    退出
                </Button>
                <Outlet />
            </div>
        </div>
    )
}

export default ManageLayout