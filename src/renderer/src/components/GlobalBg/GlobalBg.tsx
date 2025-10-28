import { useSetting } from "@renderer/hooks/useSetting";
import { FC } from "react";
import styles from './GlobalBg.module.scss';

const GlobalBg: FC = () => {
    const { backgroundImageSrc, backgroundVideoSrc, backgroundType } = useSetting()
    console.log('backgroundImageSrc: ', backgroundImageSrc)
    console.log('backgroundVideoSrc: ', backgroundVideoSrc)

    return (
        <div className={styles.globalBg}>
            {backgroundType === 'image' && (
                <img
                    key={backgroundImageSrc}
                    src={backgroundImageSrc}
                    alt="background"
                    className={styles.media}
                />
            )}
            {backgroundType === 'video' && (
                <video
                    key={backgroundVideoSrc}
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