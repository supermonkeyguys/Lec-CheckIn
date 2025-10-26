import { FC } from "react";
import styles from './Component.module.scss'

type PropsType = {
    componentList: FC<any>[];
}

const ContentComponent: FC<PropsType> = ({ componentList }) => {

    return (
        <div className={styles.pageContainer}>
            {
                componentList &&
                componentList.map(((C, index) => (
                    <C key={index} className={styles.item} />
                )))
            }
            <div></div>
        </div>
    )
}

export default ContentComponent