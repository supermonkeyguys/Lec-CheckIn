import { FC, ReactNode } from "react";
import styles from './Component.module.scss'

type PropsType = {
    children: ReactNode
}

const ContentComponent: FC<PropsType> = ({ children }) => {

    return (
        <div className={styles.pageContainer}>
            {children}
            <div></div>
        </div>
    )
}

export default ContentComponent