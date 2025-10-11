import TitleBar from "@renderer/components/TitleBar/TitleBar";
import { FC } from "react";
import { Outlet } from "react-router-dom";



const HomeLayout: FC = () => {

    return (
        <div>
            <div>
                <TitleBar />
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default HomeLayout