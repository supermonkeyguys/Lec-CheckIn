import { FC, useEffect } from "react";
import {
    Space, Form, Input, Button, Typography,
    message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import styles from './common.module.scss'
import { setToken } from "@/renderer/src/utils/use-Token";
import { loginUserService } from "../../services/user";
type PropsType = {
    onSwitch: (f: boolean) => void
}

const { Title } = Typography;

const Login: FC<PropsType> = ({ onSwitch }) => {
    const [form] = Form.useForm();

    const { run: handleLogin, loading } = useRequest(
        async ({ username, password }) => {
            const data = await loginUserService({ username, password })
            console.log(data)
            return data
        },
        {
            manual: true,
            onSuccess(res) {
                const { token } = res
                const isSaved = setToken(token)
                console.log(isSaved)
                if (isSaved) {
                    message.success('登陆成功')
                    setTimeout(() => {
                        window.electronAPI.openMainWindow()
                    },1000)
                }
                else throw new Error('token 存储失败')
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
                    initialValues={{ username: '', password: '' }}
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
                        <Input />
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