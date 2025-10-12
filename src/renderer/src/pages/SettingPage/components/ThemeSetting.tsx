import { Card, Form, Radio } from "antd";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@renderer/store";
import { updateSetting } from "@renderer/store/settingReducer";

const ThemeSetting: FC = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state: StateType) => state.setting);

    const handleThemeChange = (e: any) => {
        dispatch(updateSetting({ theme: e.target.value }));
    };

    return (
        <Card >
            <Form layout="vertical">
                <Form.Item label="主题">
                    <Radio.Group onChange={handleThemeChange} value={theme}>
                        <Radio value="light">亮色</Radio>
                        <Radio value="dark">暗色</Radio>
                        <Radio value="custom">自定义</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default ThemeSetting