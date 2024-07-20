import { useEffect, useState } from 'react';

import classNames from 'classnames';
import {
  SearchOutlined,
  DragOutlined,
  EditOutlined,
  ClearOutlined,
  FlagOutlined,
  SettingOutlined,
  WifiOutlined
} from '@ant-design/icons';

import Icon from '@/components/Icon/index.js';

import DrawSetting, { DrawSettingProps } from '../DrawSetting';
import EraserSetting, { EraserSettingProps } from '../EraserSetting';
import MarkerSelect, { MarkerSelectProps } from '../MarkerSelect';
import Setting, { SettingProps } from '../Setting';

import './style.less';

interface QuickToolsProps {
  mapInfoActive: boolean;
  isMobile: boolean;
  resolution: { width: number; height: number };
  setQuickSearchShow: (visible: boolean) => void;
  onMapInfoActive: (mapInfoActive: boolean) => void;
  onStrokeTypeChange: (strokeType: InteractiveMap.StrokeType) => void;
  setDrawLinesChange:any
}

const Index = (
  props: QuickToolsProps & MarkerSelectProps & DrawSettingProps & EraserSettingProps & SettingProps,
) => {
  const {
    mapInfoActive,
    isMobile,
    resolution,
    setQuickSearchShow,
    onMapInfoActive,
    onStrokeTypeChange,
    setDrawLinesChange,
  } = props;

  const [strokeType, setStrokeType] = useState<InteractiveMap.StrokeType>('drag');
  const [activeModal, setActiveModal] = useState<InteractiveMap.QuickTools>();

  const handleSelectDraw = () => {
    setStrokeType('draw');
  };

  const handleSelectEraser = () => {
    setStrokeType('eraser');
  };

  const handleCloseModal = () => {
    setActiveModal(undefined);
  };

  useEffect(() => {
    onStrokeTypeChange?.(strokeType);
  }, [strokeType]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      const { target } = e;
      if (target instanceof HTMLElement) {
        if (target.tagName === 'INPUT') return;
      }
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setStrokeType('drag');
      } else if (e.ctrlKey && e.key === 's') {
        // e.preventDefault();
        // handleSelectDraw();
      } else if (e.ctrlKey && e.key === 'd') {
        // e.preventDefault();
        // handleSelectEraser();
      } else if (e.ctrlKey && e.key === 'f') {
        // e.preventDefault();
        // setStrokeType('ruler');
      } else if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        setDrawLinesChange([]);
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  return (
    <div className="im-quicktools">
      <div className="im-quicktools-list">
        <div className="im-quicktools-list-item" onClick={() => setQuickSearchShow(true)} key="search">
          <SearchOutlined />
        </div>
        <div
          className={classNames('im-quicktools-list-item', {
            active: strokeType === 'drag',
          })}
          onClick={() => setStrokeType('drag')}
          key="drag"
        >
          <DragOutlined />
        </div>
        {!isMobile && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: strokeType === 'draw',
            })}
            onClick={() => handleSelectDraw()}
            onContextMenu={() => setActiveModal('draw')}
            key="draw"
          >
            <EditOutlined />
          </div>
        )}
        {!isMobile && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: strokeType === 'eraser',
            })}
            onClick={() => setDrawLinesChange([])}
            onContextMenu={() => setActiveModal('eraser')}
            key="eraser"
          >
            <ClearOutlined />
          </div>
        )}
        {/*{(isMobile || resolution.width >= 420) && (*/}
        {/*  <div*/}
        {/*    className={classNames('im-quicktools-list-item', {*/}
        {/*      active: strokeType === 'ruler',*/}
        {/*    })}*/}
        {/*    onClick={() => setStrokeType('ruler')}*/}
        {/*    key="ruler"*/}
        {/*  >*/}
        {/*    <Icon type="icon-ruler-fill" />*/}
        {/*  </div>*/}
        {/*)}*/}
        <div className="im-quicktools-list-hr" key="hr" />
        <div className="im-quicktools-list-item" onClick={() => setActiveModal('marker')} key="marker">
          <FlagOutlined />
        </div>
        {(isMobile || resolution.width >= 420) && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: mapInfoActive,
            })}
            onClick={() => onMapInfoActive?.(!mapInfoActive)}
            key="rss"
          >
            <WifiOutlined />
          </div>
        )}
        <div className="im-quicktools-list-item" onClick={() => setActiveModal('setting')} key="setting">
          <SettingOutlined />
        </div>
      </div>
      <div
        className={classNames('im-quicktools-modal', {
          active: activeModal,
        })}
        onMouseDown={handleCloseModal}
      >
        {activeModal === 'marker' && <MarkerSelect {...props} />}
        {activeModal === 'draw' && <DrawSetting {...props} />}
        {activeModal === 'eraser' && <EraserSetting {...props} />}
        {activeModal === 'setting' && <Setting {...props} />}
      </div>
    </div>
  );
};


export default Index;
