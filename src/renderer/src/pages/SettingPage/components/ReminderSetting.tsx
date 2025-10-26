import { SettingOutlined } from "@ant-design/icons";
import { useUpdateUserSetting } from "@renderer/hooks/User/uesUpdateUserSetting";
import { useSetting } from "@renderer/hooks/useSetting";
import { SettingState } from "@renderer/store/settingReducer";
import { Button, Card, Form, InputNumber, } from "antd";
import { FC, useState } from "react";

const RemindSetting: FC = () => {
    const [form] = Form.useForm()
    const { reminderTime, reminderInterval } = useSetting()
    const [pendingRemindTime, setPendingRemindTime] = useState(reminderTime)
    const [pendingIntervalTime, setPendingIntervalTime] = useState(reminderInterval)
    const { run, loading, } = useUpdateUserSetting({
        setPendingRemindTime: setPendingRemindTime,
        setRemindInterval: setPendingIntervalTime
    })

    const handleTimeChange = (value: number | null) => {
        if (value !== null && value >= 1 && value <= 4.5) {
            const rounded = Math.round(value * 2) / 2
            setPendingRemindTime(hoursToMs(rounded))
        }
    };

    const handleIntervalChange = (value: number | null) => {
        if (value !== null && value >= 10 && value <= 30) {
            const aligned = Math.round(value / 10) * 10;
            setPendingIntervalTime(minutesToMs(aligned))
        }
    };

    const onFinish = async (_: any) => {
        const  settings:SettingState = {
            reminderTime: pendingRemindTime,
            reminderInterval: pendingIntervalTime
        }
        await run(settings)
    }

    return (
        <Card>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="提醒时间"
                    tooltip="打卡时间超过5小时作废"
                >
                    <InputNumber
                        min={1}
                        max={4.5}
                        step={0.5}
                        onChange={handleTimeChange}
                        value={msToHours(pendingRemindTime || 0)}
                        formatter={(value) => `${value} 小时`}
                        parser={(value) => {
                            const num = parseFloat(value?.replace(' 小时', '') || '0')
                            return isNaN(num) ? 0 : num;
                        }}
                        style={{ width: '30%' }}
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
                        value={msToMinutes(pendingIntervalTime || 0)}
                        formatter={(value) => `${value} 分钟`}
                        parser={(value) => {
                            const num = parseInt(value?.replace(' 分钟', '') || '0', 10)
                            return isNaN(num) ? 0 : num;
                        }}
                        style={{ width: '30%' }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        icon={<SettingOutlined />}
                        disabled={loading}
                    >
                        设置
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default RemindSetting


const msToHours = (ms: number): number => {
    return ms / 3600000;
};
const hoursToMs = (hours: number): number => {
    return Math.round(hours * 3600000);
};
const msToMinutes = (ms: number): number => {
    return ms / 60000; 
};
const minutesToMs = (minutes: number): number => {
    return Math.round(minutes * 60000);
};