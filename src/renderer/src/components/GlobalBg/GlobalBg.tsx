import { useSetting } from "@renderer/hooks/useSetting";
import { FC, useEffect } from "react";
import styles from './GlobalBg.module.scss';

const GlobalBg: FC = () => {
    const { backgroundImageSrc, backgroundVideoSrc, backgroundType } = useSetting()
    
    useEffect(() => {
        return () => {
          if (backgroundVideoSrc?.startsWith('blob:')) {
            URL.revokeObjectURL(backgroundVideoSrc);
          }
        };
      }, [backgroundVideoSrc]);


    return (
        <div className={styles.globalBg}>
            {backgroundType === 'image' && (
                <img src={backgroundImageSrc} alt="background" className={styles.media} />
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