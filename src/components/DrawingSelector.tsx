import React from 'react';
import './DrawingSelector.css';

// Define the types for the drawings to ensure type safety
type DrawingId = 'apple' | 'car' | 'cat';

interface DrawingSelectorProps {
  drawings: DrawingId[];
  selectedDrawing: DrawingId;
  onSelect: (drawing: DrawingId) => void;
}

// A simple map for display names
const displayNames: Record<DrawingId, string> = {
  apple: 'りんご',
  car: 'くるま',
  cat: 'ねこ',
};

const DrawingSelector: React.FC<DrawingSelectorProps> = ({ drawings, selectedDrawing, onSelect }) => {
  return (
    <>
      {drawings.map(drawingId => (
        <button
          key={drawingId}
          className={`drawing-button ${selectedDrawing === drawingId ? 'selected' : ''}`}
          onClick={() => onSelect(drawingId)}
        >
          {displayNames[drawingId]}
        </button>
      ))}
    </>
  );
};

export default DrawingSelector;