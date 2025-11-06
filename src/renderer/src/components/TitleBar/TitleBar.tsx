import { FC } from "react";
import styles from './TitleBar.module.scss'
import { useLocation } from "react-router-dom";

const TitleBar: FC = () => {
    const location = useLocation()

    const handleCloseWindow = () => {
        if (window.electronAPI) {
            let route = '/clock/clockIn'
            if (location.pathname === '/home') route = location.pathname
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