import { ChangeEvent, FC, useEffect, useState, } from 'react';
import { Upload, Avatar, Card, Input, Space, Button, message, Row, Col, Typography } from 'antd';
import { CameraOutlined, EditOutlined, StarFilled, } from '@ant-design/icons';
import PageInfo from '../../components/PageInfo';
import Title from 'antd/es/typography/Title';
import { useGetUserInfo } from '../../hooks/User/useGetUserInfo';
import ContentComponent from '../../components/ContentComponent/Component';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import styles from './Profile.module.scss'
import { useUpdateInfo } from '../../hooks/User/useUpdateInfo';
import { useAuth } from '../../hooks/User/useAuth';
import { getUsername, removeUsername } from '@renderer/utils/use-Token';

const { Text } = Typography

interface PersonalCardProps {
    nickname: string;
    pointsBalance: number;
    grade: string;
    avatarUrl: string;
}

const NameElem = ({ name, refreshGetInfo }: { name: string; refreshGetInfo: (s: string) => void }) => {
    const [isActiveChange, setIsActiveChange] = useState(false)
    const [tempName, setTempName] = useState(name)
    const { updateInfo } = useUpdateInfo()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setTempName(e.target.value)
    }

    const handleConfirm = async () => {
        const newTitle = tempName.trim()
        if (!newTitle) {
            message.warning("标题不能为空")
        }
        try {
            await updateInfo(newTitle)
            setTempName(newTitle)
            refreshGetInfo(newTitle)
        } catch (err) {
            console.log(err)
            message.error('昵称更新失败, 请重试')
        }
        setIsActiveChange(false)
    }

    if (isActiveChange) {
        return (
            <Input
                value={tempName}
                onChange={handleChange}
                onPressEnter={handleConfirm}
                onBlur={handleConfirm}
                autoFocus
            />
        )
    }


    return (
        <Space align='baseline' style={{ display: 'flex' }}>
            <Title level={3} style={{ margin: '0' }}>
                {tempName}
            </Title>
            <Button
                type='text'
                icon={<EditOutlined />}
                onClick={() => setIsActiveChange(true)}
            />
        </Space>
    )
}

const PersonalCard: FC<PersonalCardProps> = ({ nickname, pointsBalance, grade, avatarUrl }) => {
    const [avatar, setAvatar] = useState<string | null>(avatarUrl)
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const { token, loading } = useAuth()
    const { refreshGetInfo } = useGetUserInfo()

    const handleChange = ({ file, fileList }: UploadChangeParam<UploadFile>) => {
        setFileList(fileList)
        if (file.status === 'done') {
            const url = file.response?.data?.avatarUrl || file.url
            if (url) {
                setAvatar(url)
            }
            message.success('上传成功')
        } else if (file.status === 'error') {
            message.error('头像上传失败')
        }
    }

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式! ')
            return false
        }
        const is2M = file.size / 1024 / 1024 < 2
        if (!is2M) {
            message.error('图片不能超过 2MB!')
            return false
        }
        return true
    }

    const handleLogout = () => {
        window.electronAPI?.userLogout(getUsername())
        removeUsername()
        window.electronAPI?.removeWindow('/clock/clockIn')
        window.electronAPI?.openWindow('/home')
    }

    if (loading) return (
        <div>加载中...</div>
    )

    return (
        <Card >
            <div className={styles.profileCard}>
                <Row gutter={20}>
                    <div className={styles.avatarContainer}>
                        <Avatar size={90} src={avatar} className={styles.avatar} />
                        <Upload
                            className={styles.uploadOverlay}
                            action={`http://43.138.244.158:8080/api/user/avatar`}
                            name='avatar'
                            headers={{
                                Authorization: `Bearer ${token}`
                            }}
                            listType='picture'
                            maxCount={1}
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            showUploadList={false}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.uploadMask}>
                                <CameraOutlined className={styles.iconMask} />
                            </div>
                        </Upload>
                    </div>

                    <Col>
                        <NameElem
                            name={nickname}
                            refreshGetInfo={refreshGetInfo}
                        />
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            {getGrade(grade)}
                        </Text>
                        <Row style={{ marginTop: 10 }}>
                            <StarFilled style={{ color: '#F59E0B', marginRight: 8, fontSize: 20 }} />
                            <Text type="secondary" style={{ fontSize: 15 }}>
                                当前积分: <strong style={{ color: 'black', fontSize: 15 }}>{pointsBalance}</strong>
                            </Text>
                        </Row>
                    </Col>
                </Row>
                <Button
                    className={styles.exitBtn}
                    onClick={handleLogout}
                    type='link'
                >
                    退出
                </Button>
            </div>
        </Card>
    )
}

const Profile: FC = () => {

    const { userInfo, refreshGetInfo } = useGetUserInfo()

    useEffect(() => {
        refreshGetInfo()
    }, [])


    return (
        <ContentComponent
            componentList={[
                () => <PageInfo title='个人页面' desc='查看个人信息' />,
                () => userInfo && <PersonalCard avatarUrl={''} nickname={''} pointsBalance={0} grade={''} {...userInfo} />
            ]}
        />
    );
};

export default Profile;

export function getGrade(grade: string) {
    switch (grade) {
        case 'all':
            return '全部'
        case 'freshman':
            return '大一'
        case 'sophomore':
            return '大二'
        case 'junior':
            return '大三'
        case 'senior':
            return '大四'
        default:
            return '???'
    }
}