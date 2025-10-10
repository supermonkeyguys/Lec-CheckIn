import { Button, Result } from "antd";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CLOCKIN_PAGE_PATHNAME } from "../router/router";

const NotFound: FC = () => {
    const nav = useNavigate()
    const location = useLocation()

    console.log(location)
    return (
        <Result
            status='404'
            title='404'
            subTitle='Sorry, 当前访问的页面不存在了'
            extra={
                <Button
                    type='primary'
                    onClick={() => nav(CLOCKIN_PAGE_PATHNAME)}
                >
                    返回首页
                </Button>
            }
        />
    )
}

export default NotFound