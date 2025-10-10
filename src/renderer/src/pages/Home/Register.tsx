import { FC } from "react";
import { Button, Form, Input, message, Select, Space } from "antd";
import Title from "antd/es/typography/Title";
import { UserAddOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import styles from './common.module.scss'
import { registerUserService } from "../../services/user";

type PropsType = {
    onSwitch: (f: boolean) => void
}

const Register: FC<PropsType> = ({ onSwitch }) => {
    const [form] = Form.useForm()

    const { run: onSubmit, loading } = useRequest(
        async ({ username, password, grade, nickname }) => {
            await registerUserService({ username, password, grade, nickname })
        },
        {
            manual: true,
            onSuccess() {
                message.success('注册成功')
                onSwitch(true)
            }
        }
    )

    const onFinish = (value: any) => {
        onSubmit(value)
    }

    return (
        <div className={styles.cardContent}>
            <div className={styles.cardTitle}>
                <Space align="center">
                    <Title level={3}>
                        <UserAddOutlined />
                    </Title>
                    <Title level={3}>
                        注册新用户
                    </Title>
                </Space>
            </div>
            <div>
                <Form
                    labelCol={{ span: 6 }}
                    form={form}
                    onFinish={onFinish}
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
                        label='昵称'
                        name='nickname'
                        rules={[
                            { required: true, message: "请输入昵称" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='年级'
                        name='grade'
                        rules={[
                            { required: true, message: "请选择身份" }
                        ]}
                    >
                        <Select
                            options={[
                                { value: 'freshman', label: "大一小东西" },
                                { value: 'sophomore', label: "大二老东西" },
                                { value: 'junior', label: "大三老老东西" },
                                { value: 'senior', label: "绝版老登" },
                            ]} />
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
                    <Form.Item
                        label='确认密码'
                        name='confirm'
                        rules={[
                            { required: true, message: '请输入密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    else {
                                        return Promise.reject();
                                    }
                                }
                            })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item className={styles.handleBtn} >
                        <Button
                            style={{ marginRight: '20px' }}
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                        >
                            注册
                        </Button>
                        <Button
                            type="link"
                            onClick={() => {
                                onSwitch(true)
                            }}
                        >
                            去登陆
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Register