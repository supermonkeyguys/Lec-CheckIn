import { useSetting } from "@renderer/hooks/useSetting";
import { updateSetting } from "@renderer/store/settingReducer";
import { Card, Form, InputNumber } from "antd";
import { FC } from "react";
import { useDispatch } from "react-redux";

const RemindSetting: FC = () => {
    const dispatch = useDispatch();
    const { reminderTime, reminderInterval } = useSetting()

    const handleTimeChange = (value: number | null) => {
        if (value !== null && value >= 1 && value <= 4.5) {
            const rounded = Math.round(value * 2) / 2
            dispatch(updateSetting({ reminderTime: hoursToMs(rounded) }))
        }
    };

    const handleIntervalChange = (value: number | null) => {
        if (value !== null && value >= 10 && value <= 30) {
            const aligned = Math.round(value / 10) * 10;
            dispatch(updateSetting({ reminderInterval: minutesToMs(aligned) }))
        }
    };

    return (
        <Card>
            <Form layout="vertical">
                <Form.Item
                    label="提醒时间"
                    tooltip="打卡时间超过5小时作废"
                >
                    <InputNumber
                        min={1}
                        max={4.5}
                        step={0.5}
                        onChange={handleTimeChange}
                        value={msToHours(reminderTime)}
                        formatter={(value) => `${value} 小时`}
                        parser={(value) => {
                            const num = parseFloat(value?.replace(' 小时', '') || '0')
                            return isNaN(num) ? 0 : num;
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="提醒间隔 (分钟)"
                    tooltip="超过提醒时间后间隔提醒"
                >
                    <InputNumber
                        min={10}
                        max={30}
                        step={10} 
                        onChange={handleIntervalChange}
                        value={msToMinutes(reminderInterval)}
                        formatter={(value) => `${value} 分钟`}
                        parser={(value) => {
                            const num = parseInt(value?.replace(' 分钟', '') || '0', 10)
                            return isNaN(num) ? 0 : num;
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Form>
        </Card>
    );
};

export default RemindSetting


const msToHours = (ms: number): number => {
    return ms / 3600000; // 1小时 = 3600000 ms
};
const hoursToMs = (hours: number): number => {
    return Math.round(hours * 3600000);
};
const msToMinutes = (ms: number): number => {
    return ms / 60000; // 1分钟 = 60000 ms
};
const minutesToMs = (minutes: number): number => {
    return Math.round(minutes * 60000);
};