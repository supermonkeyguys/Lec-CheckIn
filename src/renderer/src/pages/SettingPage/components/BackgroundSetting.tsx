import { updateSetting } from "@renderer/store/settingReducer";
import { Button, Card, Form, message, Radio, Space } from "antd";
import Upload, { RcFile } from "antd/es/upload";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { useSetting } from "@renderer/hooks/useSetting";
import { useAuth } from "@renderer/hooks/User/useAuth";
import styles from './common.module.scss'


const BackgroundSetting: FC = () => {
    const dispatch = useDispatch()
    const { backgroundType, backgroundImageSrc, backgroundVideoSrc } = useSetting()
    const { userId, token } = useAuth()
    const [uploading, setUploading] = useState(false)
    const [pendingType, setPendingType] = useState(backgroundType)
    const [preview, setPreview] = useState<string | null>(null)
    const pendingTypeRef = useRef(pendingType)

    useEffect(() => {
        pendingTypeRef.current = pendingType
    }, [pendingType])

    const handleTypeChange = (e: any) => {
        if (e.target.value === 'none') {
            dispatch(updateSetting({ backgroundType: 'none' }))
        }
        setPendingType(e.target.value)
        setPreview(null)
    }

    const beforeUpload = (file: RcFile) => {
        const isImage = pendingType === 'image';
        const isVideo = pendingType === 'video';
        const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        if (isImage && !file.type.startsWith('image/')) {
            message.error('请上传图片文件!');
            return false;
        }
        if (isVideo && !file.type.startsWith('video/')) {
            message.error('请上传视频文件!');
            return false;
        }
        if (file.size > maxSize) {
            message.error(`${isImage ? '图片' : '视频'}大小不能超过${isImage ? '5MB' : '50MB'}`);
            return false;
        }

        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
        return true;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setUploading(true)
        }
        else if (info.file.status === 'done') {
            setUploading(false)
            const resultUrl = info.file.response?.data?.updatedSetting.backgroundSrc
                || URL.createObjectURL(info.file.originFileObj as RcFile);

            console.log(resultUrl)
            setPreview(resultUrl)
            if (pendingType === 'image') dispatch(updateSetting({ backgroundType: 'image', backgroundImageSrc: resultUrl }))
            if (pendingType === 'video') dispatch(updateSetting({ backgroundType: 'video', backgroundVideoSrc: resultUrl }))
            message.success('背景已更新')
        } else if (info.file.status === 'error') {
            setUploading(false)
            message.error('上传失败')
        }
    }

    const accept = pendingType === 'video' ? 'video/*' : 'image/*';
    const uploadText = pendingType === 'video' ? '选择视频' : '选择图片';
    const displayPreview = preview || (pendingType === 'video' ? backgroundVideoSrc : backgroundImageSrc) || '';

    return (
        <Card>
            <Form layout="vertical">
                <Form.Item label="背景类型">
                    <Radio.Group
                        disabled={uploading}
                        onChange={handleTypeChange}
                        value={pendingType}
                    >
                        <Radio value="none">无</Radio>
                        <Radio value="image">图片</Radio>
                        <Radio value="video">视频</Radio>
                    </Radio.Group>
                </Form.Item>

                {(pendingType === 'image' || pendingType === 'video') && (
                    <Form.Item
                        label="背景文件"
                        help={backgroundType === 'image'
                            ? '支持JPG、PNG等格式, 最大5MB'
                            : '支持MP4等格式, 最大50MB'
                        }
                    >
                        <div className={styles.uploadContainer}>
                            <Space>
                                <Upload
                                    action={`/api/user/background?userId=${userId}&backgroundType=${pendingType}`}
                                    name='background'
                                    headers={{
                                        Authorization: `Bearer ${token}`
                                    }}
                                    maxCount={1}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    accept={accept}
                                    showUploadList={false}
                                >
                                    <Button
                                        loading={uploading}
                                        type="primary"
                                        icon={<UploadOutlined />}
                                    >
                                        {uploadText}
                                    </Button>
                                </Upload>
                            </Space>
                        </div>

                        {displayPreview && (
                            <div className={styles.previewContainer}>
                                {backgroundType === 'video' ? (
                                    <video
                                        className={styles.video}
                                        src={displayPreview}
                                        autoPlay
                                        muted
                                        loop
                                    />
                                ) : (
                                    <img
                                        className={styles.image}
                                        src={displayPreview}
                                        alt="background preview"
                                    />
                                )}
                            </div>
                        )}
                    </Form.Item>
                )}
            </Form>
        </Card >
    )
}

export default BackgroundSetting