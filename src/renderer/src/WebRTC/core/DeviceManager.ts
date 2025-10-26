export type StreamType = 'camera' | 'screen'

export class DeviceManager {
  private currentScreenStream: MediaStream | null = null 

  async getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();

    return {
      audioInputs: devices
        .filter((d) => d.kind === 'audioinput')
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `麦克风 ${d.deviceId.slice(0, 5)}`,
          kind: d.kind
        })),

      videoInputs: devices
        .filter((d) => d.kind === 'videoinput')
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `摄像头 ${d.deviceId.slice(0, 5)}`,
          kind: d.kind
        })),

      audioOutputs: devices
        .filter((d) => d.kind === 'audiooutput')
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `扬声器 ${d.deviceId.slice(0, 5)}`,
          kind: d.kind
        }))
    };
  }

  async getLocalStream(type:StreamType,constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      console.log('type: ',type)
      if (type === 'screen') {

        if(this.currentScreenStream && this.isStreamActive(this.currentScreenStream)) {
          return this.currentScreenStream
        }

        this.currentScreenStream = await this.getScreenStreamWithPicker();

        this.currentScreenStream.getVideoTracks()[0].onended = () => {
          this.currentScreenStream = null
        }
        console.log(this.currentScreenStream)
        return this.currentScreenStream
      }

      return await navigator.mediaDevices.getUserMedia(constraints as MediaStreamConstraints);
    } catch (err) {
      console.error('获取媒体流失败:', err);
      throw err;
    }
  }

  async checkPermissions() {
    let audio = false, video = false;

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audio = true;
      audioStream.getTracks().forEach(t => t.stop());
    } catch {}

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      video = true;
      videoStream.getTracks().forEach(t => t.stop());
    } catch {}

    return { audio, video };
  }

  // 带 UI 的屏幕共享（触发全局事件）
  async getScreenStreamWithPicker(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      const handleSelect = async (source: { id: string }) => {
        try {
          const stream = await this.createScreenStreamFromSource(source.id);
          resolve(stream);
        } catch (err) {
          reject(err);
        }
      };

      const handleCancel = () => {
        reject(new Error('用户取消屏幕共享'));
      };

      window.dispatchEvent(
        new CustomEvent('request-screen-picker', {
          detail: { onSelect: handleSelect, onCancel: handleCancel }
        })
      );
    });
  }

  // 根据 source.id 创建流
  async createScreenStreamFromSource(sourceId: string): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          minHeight: 720,
          maxWidth: 1920,
          maxHeight: 1080
        }
      }
    } as any);
  }

  private isStreamActive(stream: MediaStream): boolean {
    return stream.getTracks().some(track => track.readyState === 'live')
  }
}