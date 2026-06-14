import React from 'react';
import './Toolbar.css';
import { Tool } from '../types';

const TOOL_LABELS: Record<Tool, string> = {
  bucket: 'バケツ',
  brush: 'ペン',
  eraser: 'けしゴム',
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
            {TOOL_LABELS[tool]}
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button className="action-button" onClick={onUndo}>
          やりなおし
        </button>
        <button className="action-button" onClick={onClear}>
          ぜんぶけす
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
