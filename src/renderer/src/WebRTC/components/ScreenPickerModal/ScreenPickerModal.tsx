// @renderer/components/ScreenPickerModal.tsx
import { DesktopSource } from '@renderer/WebRTC/types/webrtc.types';
import React, { useState, useEffect } from 'react';

interface ScreenPickerModalProps {
  onClose: () => void;
  onSelect: (source: DesktopSource) => void;
}

export const ScreenPickerModal: React.FC<ScreenPickerModalProps> = ({
  onClose,
  onSelect,
}) => {
  const [sources, setSources] = useState<DesktopSource[]>([]);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const rawSources = await window.electronAPI?.getDesktopSources();

      const formatted = rawSources
      setSources(formatted);
    } catch (err) {
      console.error('加载屏幕源失败:', err);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="screen-picker-modal" onClick={(e) => e.stopPropagation()}>
        <h3>选择要共享的内容</h3>
        <div className="sources-grid">
          {sources.map(source => (
            <div
              key={source.id}
              className="source-item"
              onClick={() => onSelect(source)}
            >
              <img src={source.thumbnail} alt={source.name} />
              <p>{source.name}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose}>取消</button>
      </div>
    </div>
  );
};