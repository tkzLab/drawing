import React from 'react';
import './Toolbar.css';
import { Tool } from '../types';

const TOOL_LABELS: Record<Tool, string> = {
  bucket: 'バケツ',
  brush: 'ペン',
  eraser: 'けしゴム',
};

const TOOL_ICONS: Record<Tool, string> = {
  bucket: '🪣',
  brush: '✏️',
  eraser: '🧽',
};

interface ToolbarProps {
  tools: Tool[];
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ tools, currentTool, onToolChange, onUndo, onClear }) => {
  return (
    <div className="toolbar-container">
      <div className="tool-selection">
        {tools.map(tool => (
          <button
            key={tool}
            className={`tool-button ${currentTool === tool ? 'active' : ''}`}
            onClick={() => onToolChange(tool)}
          >
            <span className="btn-icon" aria-hidden="true">{TOOL_ICONS[tool]}</span>
            <span className="btn-label">{TOOL_LABELS[tool]}</span>
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button className="action-button" onClick={onUndo}>
          <span className="btn-icon" aria-hidden="true">↩️</span>
          <span className="btn-label">やりなおし</span>
        </button>
        <button className="action-button" onClick={onClear}>
          <span className="btn-icon" aria-hidden="true">🗑️</span>
          <span className="btn-label">ぜんぶけす</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
