import Renderer from "electron/renderer";
import { FC } from "react";
import styles from './TitleBar.module.scss'

const TitleBar: FC = () => {

    const handleCloseWindow = () => {
        if (window.electron?.ipcRenderer) {
            window.electron.ipcRenderer.send('close-window')
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