import { updateSetting } from "@renderer/store/settingReducer";
import { Button, Card, Form, message, Radio, Space } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateUserSetting } from "@renderer/hooks/User/uesUpdateUserSetting";
import { useSetting } from "@renderer/hooks/Setting/useSetting";
import styles from "./common.module.scss";


const BackgroundSetting: FC = () => {
  const dispatch = useDispatch();
  const { backgroundType } = useSetting();
  const [uploading, setUploading] = useState(false);
  const [pendingType, setPendingType] = useState(backgroundType);
  const { run, loading } = useUpdateUserSetting({})

  const pendingTypeRef = useRef(pendingType)
  useEffect(() => {
    pendingTypeRef.current = pendingType
  }, [pendingType])

  const handleTypeChange = (e: any) => {
    const newType = e.target.value
    if (newType === "none") {
      dispatch(updateSetting({ backgroundType: 'none' }))
    }
    setPendingType(newType)
  }

  const handleLocalVideoUpload = async () => {
    if (!window.electronAPI) {
      message.error("Electron API 不可用")
      return;
    }

    try {
      setUploading(true);
      const res = await window.electronAPI.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "视频文件", extensions: ["mp4", "mov", "avi", "mkv"] }],
      });

      if (!res || res.canceled || !res.filePaths?.length) {
        setUploading(false)
        message.info("已取消选择视频")
        return;
      }

      const videoPath = res.filePaths[0]
      await window.electronAPI.setBackgroundVideo(videoPath)

      // 获取背景视频的 Buffer 并生成 Blob URL
      const raw = await window.electronAPI.getBgVideoBuffer()
      if(!raw) {
        message.error('加载失败')
        return 
      }

      const u8 = raw?.data && Array.isArray(raw.data) ? new Uint8Array(raw.data) : new Uint8Array(raw)
      const blob = new Blob([u8], { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)

      console.log('blobUrl: ', url)

      run({ backgroundType: 'video' })
      dispatch(updateSetting({
        backgroundType: "video",
        backgroundVideoSrc: url,
        backgroundImageSrc: '' , 
      }));
      message.success("视频背景设置成功")
    } catch (err) {
      console.error("error:", err);
      message.error("设置失败，请重试")
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!window.electronAPI) return

    try {
      setUploading(true);
      const res = await window.electronAPI.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
      });

      if (!res || res.canceled || !res.filePaths?.length) return

      const src = res.filePaths[0];
      await window.electronAPI.setBackgroundImage(src)

      const raw = await window.electronAPI?.getBgImageBuffer()
      if (!raw) {
        message.error('图片加载失败')
        return
      }
      
      const u8 = raw?.data && Array.isArray(raw.data) ? new Uint8Array(raw.data) : new Uint8Array(raw)
      const blob = new Blob([u8], { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)
      console.log('url: ',url)

      run({ backgroundType: 'image' })
      dispatch(updateSetting({
        backgroundType: 'image',
        backgroundImageSrc: url,
        backgroundVideoSrc: '',
      }));

      message.success('图片背景设置成功');
    } catch (err) {
      console.error("error:", err);
      message.error("设置失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (pendingType === "video") handleLocalVideoUpload();
    else if (pendingType === 'image') {
      handleImageUpload();
    }
  };

  return (
    <Card>
      <Form layout="vertical">
        <Form.Item label="背景类型">
          <Radio.Group
            disabled={uploading}
            onChange={handleTypeChange}
            value={pendingType}
          >
            <Radio value="none" onClick={() => run({ backgroundType: 'none' })}>无</Radio>
            <Radio value="image">图片</Radio>
            <Radio value="video">视频</Radio>
          </Radio.Group>
        </Form.Item>

        {(pendingType === "image" || pendingType === "video") && (
          <Form.Item
            label="背景文件"
            help={
              pendingType === "image"
                ? "支持 JPG、PNG 等格式，最大 5MB"
                : "支持 MP4、MOV 等格式，最大 50MB"
            }
          >
            <div className={styles.uploadContainer}>
              <Space>
                <Button
                  loading={uploading || loading}
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handleUploadClick}
                >
                  {pendingType === "video" ? "选择视频" : "选择图片"}
                </Button>
              </Space>
            </div>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default BackgroundSetting;
