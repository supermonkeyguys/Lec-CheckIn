import { FC } from "react";
import SideBar from "../components/SideBar/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import styles from './ManageLayout.module.scss'
import { Button } from "antd";
import { removeToken } from "@/renderer/src/utils/use-Token";

const ManageLayout: FC = () => {
    const nav = useNavigate()

    const handleLogout = () => {
        removeToken()
        nav('/')
    }

    return (
        <div className={styles.layoutContainer}>
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