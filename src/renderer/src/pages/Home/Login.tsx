import { FC } from "react";
import {
    Space, Form, Input, Button, Typography,
    message,
    Checkbox,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import styles from './common.module.scss'
import { loginUserService } from "../../services/user";
import { setUsername } from "@renderer/utils/use-Token";
type PropsType = {
    onSwitch: (f: boolean) => void
}

const { Title } = Typography;

const Login: FC<PropsType> = ({ onSwitch }) => {
    const [form] = Form.useForm();

    const { run: handleLogin, loading } = useRequest(
        async ({ username, password, remember }) => {
            const res = await loginUserService({ username, password })
            const { token } = res

            setUsername(username)
            await window.electronAPI?.userLogin({token, username,remember})

            return res
        },
        {
            manual: true,
            onSuccess: async () => {
                message.success('登陆成功')
                setTimeout(() => {
                    window.electronAPI!.openWindow('/clock/clockIn')
                    window.electronAPI!.removeWindow('/home')
                }, 1000)
            },
            onError(err) {
                message.error('登录失败')
                console.error(err)
            }
        }
    )

    return (
        <div className={styles.cardContent}>
            <div className={styles.cardTitle}>
                <Space align="center">
                    <Title level={3}>
                        <UserOutlined />
                    </Title>
                    <Title level={3}>
                        账户登录
                    </Title>
                </Space>
            </div>
            <div>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ username: '', password: '', remember: false }}
                    onFinish={handleLogin}
                >
                    <Form.Item
                        label='用户名'
                        name='username'
                        rules={[
                            { required: true, message: '请输入用户名' },
                            {
                                type: "string",
                                min: 5,
                                max: 20,
                                message: '字符长度在 5 ~ 20 之间',
                            },
                            { pattern: /^\w+$/, message: "只能是字母或者下划线" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='密码'
                        name='password'
                        rules={[
                            { required: true, message: '请输入密码' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>自动登录</Checkbox>
                    </Form.Item>
                    <Form.Item className={styles.handleBtn}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                        >
                            登录
                        </Button>
                        <Button
                            type="link"
                            onClick={() => {
                                onSwitch(false)
                            }}
                        >
                            去注册
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;