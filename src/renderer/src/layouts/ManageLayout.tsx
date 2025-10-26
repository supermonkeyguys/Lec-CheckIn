import { FC, useEffect, useState } from "react";
import SideBar from "../components/SideBar/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import styles from './ManageLayout.module.scss'
import TitleBar from "@renderer/components/TitleBar/TitleBar";
import useSettingSync from "@renderer/hooks/Setting/useLoadSetting";
import { ScreenPickerModal } from "@renderer/WebRTC/components/ScreenPickerModal/ScreenPickerModal";

const ManageLayout: FC = () => {
    const location = useLocation()
    const [pickState, setPickState] = useState<{
        onSelect: (source: any) => void,
        onCancel: () => void
    } | null>(null)
    const pathname = location.pathname
    useSettingSync()

    useEffect(() => {
        const handleScreenPicker = (e: CustomEvent) => {
            setPickState(e.detail)
        }

        window.addEventListener('request-screen-picker', handleScreenPicker as EventListener)

        return () => {
            window.removeEventListener('request-screen-picker', handleScreenPicker as EventListener)
        }
    }, [])

    const handleClose = () => {
        pickState?.onCancel()
        setPickState(null)
    }

    const handleSelect = (source:any) => {
        pickState?.onSelect(source)
        setPickState(null)
    }

    return (
        <div className={`${styles.layoutContainer}`}>
            <div>
                <TitleBar />
            </div>
            {!pathname.startsWith('/clock/conference') && <SideBar />}
            <div className={styles.outletContainer}>
                <Outlet />
            </div>
            {pickState && (
                <ScreenPickerModal 
                    onSelect={handleSelect}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}

export default ManageLayout