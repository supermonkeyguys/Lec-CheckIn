import { FC } from "react";
import styles from './GlobalBg.module.scss'
import { useSetting } from "@renderer/hooks/useSetting";

const GlobalBg: FC = () => {
    const { backgroundImageSrc, backgroundVideoSrc , backgroundType } = useSetting()

    return (
        <div className={styles.globalBg}>
            {backgroundType === 'image' && (
                <img src={backgroundImageSrc} alt="background" className={styles.media} />
            )}
            {backgroundType === 'video' && (
                <video
                    muted
                    autoPlay
                    playsInline
                    loop
                    src={backgroundVideoSrc}
                    className={styles.media}
                />
            )}
        </div>
    )
}

export default GlobalBg