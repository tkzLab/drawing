import React from 'react';
import './Toolbar.css';

export type Tool = 'bucket' | 'brush' | 'eraser';

interface ToolbarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onReset: () => void;
  isBucketDisabled?: boolean;
  isUndoDisabled?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  onToolChange,
  onUndo,
  onReset,
  isBucketDisabled = false,
  isUndoDisabled = false,
}) => {
  return (
    <div className="toolbar-container">
      <div className="tool-selection">
        <button
          className={`tool-button ${currentTool === 'bucket' ? 'active' : ''}`}
          onClick={() => onToolChange('bucket')}
          disabled={isBucketDisabled}
        >
          バケツ
        </button>
        <button
          className={`tool-button ${currentTool === 'brush' ? 'active' : ''}`}
          onClick={() => onToolChange('brush')}
        >
          ブラシ
        </button>
        <button
          className={`tool-button ${currentTool === 'eraser' ? 'active' : ''}`}
          onClick={() => onToolChange('eraser')}
        >
          けしゴム
        </button>
      </div>
      <div className="action-buttons">
        <button className="action-button" onClick={onUndo} disabled={isUndoDisabled}>
          やりなおし
        </button>
        <button className="action-button" onClick={onReset}>
          ぜんぶけす
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
