import { FC } from "react";
import SideBar from "../components/SideBar/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import styles from './ManageLayout.module.scss'
import { Button } from "antd";
import { removeToken } from "@renderer/utils/use-Token";
import TitleBar from "@renderer/components/TitleBar/TitleBar";

const ManageLayout: FC = () => {

    const handleLogout = () => {
        removeToken()
        window.electronAPI?.openWindow('/')
        window.electronAPI?.removeWindow('/clock/clockIn')
    }

    return (
        <div className={styles.layoutContainer}>
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