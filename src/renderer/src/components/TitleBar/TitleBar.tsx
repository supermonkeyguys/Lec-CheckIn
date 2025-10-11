import Renderer from "electron/renderer";
import { FC } from "react";
import styles from './TitleBar.module.scss'
import { Outlet, useLocation } from "react-router-dom";

const TitleBar: FC = () => {
    const location = useLocation()
    
    const handleCloseWindow = () => {
        if (window.electronAPI) { 
            window.electronAPI.removeWindow(location.pathname)
        }
        else {
            window.close()
        }
    }

    return (
        <div className={styles.titleBar}>
            <div className={styles.title}>LEC - CheckIn</div>
            <div>
                <button onClick={handleCloseWindow} className={styles.closeBtn}>×</button>
            </div>
        </div>
    )
}

export default TitleBar