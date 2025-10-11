import { FC, useState } from "react";
import Login from "./Login";
import styles from './common.module.scss'
import Register from "./Register";
import TitleBar from "@renderer/components/TitleBar/TitleBar";


const Home: FC = () => {
    const [isLogin, setIsLogin] = useState(true)


    return (
        <>
            <TitleBar />
            <div className={styles.PageContainer}>
                <div
                    className={`${styles.card} 
                ${styles.loginCard}
                ${isLogin ? styles.isActive : styles.unActive}`
                    }
                >
                    <Login onSwitch={setIsLogin} />
                </div>

                <div
                    className={`${styles.card} 
                ${styles.registerCard}
                ${isLogin ? styles.unActive : styles.isActive}`
                    }
                >
                    <Register onSwitch={setIsLogin} />
                </div>
            </div>
        </>
    )
}

export default Home