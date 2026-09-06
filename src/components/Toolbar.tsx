import React from 'react';
import './Toolbar.css';
import { Tool } from '../types';

const TOOL_LABELS: Record<Tool, string> = {
  bucket: 'バケツ',
  brush: 'ペン',
  paintbrush: 'ブラシ',
  eraser: 'けしゴム',
};

const TOOL_ICONS: Record<Tool, string> = {
  bucket: `${import.meta.env.BASE_URL}ui/tools/bucket.png`,
  brush: `${import.meta.env.BASE_URL}ui/tools/pencil.png`,
  paintbrush: `${import.meta.env.BASE_URL}ui/tools/paintbrush.png`,
  eraser: `${import.meta.env.BASE_URL}ui/tools/eraser.png`,
};

interface ToolbarProps {
  tools: Tool[];
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onClear: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onComplete?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tools, currentTool, onToolChange, onUndo, onClear, onZoomIn, onZoomOut, onResetZoom, onComplete,
}) => {
  return (
    <div className="toolbar-container">
      <div className="tool-selection">
        {tools.map(tool => (
          <button
            key={tool}
            className={`tool-button ${currentTool === tool ? 'active' : ''}`}
            onClick={() => onToolChange(tool)}
          >
            <img className="btn-icon" src={TOOL_ICONS[tool]} alt="" aria-hidden="true" />
            <span className="btn-label">{TOOL_LABELS[tool]}</span>
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button className="action-button action-button--undo" onClick={onUndo} aria-label="もどす">
          <span className="btn-icon" aria-hidden="true">↩️</span>
          <span className="btn-label">もどす</span>
        </button>
        <button className="action-button action-button--clear" onClick={onClear} aria-label="ぜんぶけす">
          <span className="btn-icon" aria-hidden="true">🗑️</span>
          <span className="btn-label">ぜんぶけす</span>
        </button>
      </div>
      {onZoomIn && onZoomOut && onResetZoom && (
        <div className="zoom-buttons" aria-label="えを おおきく する">
          <button className="zoom-button" onClick={onZoomOut} aria-label="ちいさくする">−</button>
          <button className="zoom-reset" onClick={onResetZoom}>ぜんたい</button>
          <button className="zoom-button" onClick={onZoomIn} aria-label="おおきくする">＋</button>
        </div>
      )}
      {onComplete && (
        <button type="button" className="toolbar-complete" onClick={onComplete}>
          <span aria-hidden="true">★</span> できた！
        </button>
      )}
    </div>
  );
};

export default Toolbar;
