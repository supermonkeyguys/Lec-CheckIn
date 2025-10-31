import { FC } from "react";
import styles from './TitleBar.module.scss'
import { useLocation } from "react-router-dom";
import { useSetting } from "@renderer/hooks/useSetting";

const TitleBar: FC = () => {
    const location = useLocation()
    const { theme } = useSetting()
    console.log('theme: ', theme)

    const handleCloseWindow = () => {
        if (window.electronAPI) {
            let route = '/clock/clockIn'
            if (location.pathname === '/home') route = location.pathname
            console.log(route)
            window.electronAPI.removeWindow(route)
        }
        else {
            window.close()
        }
    }

    const handleMinimizeWindow = () => {
        if (window.electronAPI) {
            let route = '/clock/clockIn'
            if (location.pathname === '/home') route = location.pathname
            console.log(route)
            window.electronAPI.minimizeWindow(route)
        }
    }

    return (
        <div className={styles.titleBar}>
            <div className={styles.title}>LEC - CheckIn</div>

            <div className={styles.windowControls}>
                <button onClick={handleMinimizeWindow} className={styles.minimizeBtn}>−</button>
                <button onClick={handleCloseWindow} className={styles.closeBtn}>×</button>
            </div>
        </div>
    )
}

export default TitleBar