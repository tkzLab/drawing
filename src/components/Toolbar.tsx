import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  onUndo: () => void;
  onReset: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onUndo, onReset }) => {
  return (
    <>
      <button className="tool-button" onClick={onUndo}>やりなおし</button>
      <button className="tool-button" onClick={onReset}>ぜんぶけす</button>
    </>
  );
};

export default Toolbar;
