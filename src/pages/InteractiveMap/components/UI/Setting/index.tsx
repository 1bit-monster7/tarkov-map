import './style.less';
import { useState } from 'react';

export interface SettingProps {
  locationScale: boolean;
  onLocationScaleChange: (b: boolean) => void;
  pinTheWindow:boolean;
  onPinTheWindowChange: (b: boolean) => void;
}
let ipcRenderer: any; // 声明 ipcRenderer 变量

// 检查是否在 Electron 环境中
if (window.require) {
  try {
    const electron = window.require('electron');
    if (electron) {
      ipcRenderer = electron.ipcRenderer;
    }
  } catch (error) {
    console.error('Failed to load electron', error);
  }
}

const Index = (props: SettingProps) => {
  const { locationScale, onLocationScaleChange,pinTheWindow,onPinTheWindowChange } = props;
  const handleToggleLocationScale = () => {
    onLocationScaleChange(!locationScale);
  };

  const handleSetFixedWindows = () => {
    const newFixedWindows = !pinTheWindow; // 计算更新后的值
    onPinTheWindowChange(newFixedWindows);
    ipcRenderer.invoke('toggle_always_on_top', newFixedWindows);
  };

  return (
    <div className="im-quicktools-modal-setting" onMouseDown={(e) => e.stopPropagation()}>
      <div className="im-quicktools-modal-setting-title">
        <span>高级设置</span>
      </div>
      <div className="im-quicktools-modal-setting-block">
        <button
          className="im-quicktools-modal-setting-button"
          style={{ color: !locationScale ? '#882828' : '#288828' }}
          onClick={handleToggleLocationScale}
        >
          标点缩放 ({locationScale ? '启用' : '禁用'})
        </button>

        <button
          className="im-quicktools-modal-setting-button"
          style={{ color: pinTheWindow ? '#288828' : '#882828' }}
          onClick={handleSetFixedWindows}
        >
          固定窗口 ({pinTheWindow ? '启用' : '禁用'})
        </button>
      </div>
    </div>
  );
};

export default Index;
