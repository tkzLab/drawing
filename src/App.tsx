import React, { useState, useRef } from 'react';
import './App.css';
import ColorPalette from './components/ColorPalette';
import Toolbar, { Tool } from './components/Toolbar';
import DrawingSelector from './components/DrawingSelector';
import Apple from './drawings/Apple';
import Car from './drawings/Car';
import Cat from './drawings/Cat';

type DrawingComponentType = 'apple' | 'car' | 'cat';

// Define a type for the ref to expose a clear function
export interface DrawingHandle {
  clearCanvas: () => void;
}

const drawingComponents: Record<DrawingComponentType, React.FC<any>> = {
  apple: Apple,
  car: Car,
  cat: Cat,
};

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [currentTool, setCurrentTool] = useState<Tool>('bucket');
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingComponentType>('apple');
  const [fills, setFills] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  
  const drawingRef = useRef<DrawingHandle>(null);

  const handleSelectDrawing = (drawing: DrawingComponentType) => {
    setSelectedDrawing(drawing);
    setFills({});
    setHistory([]);
    // The canvas will be cleared by the component itself on key change
  };

  const handleFill = (partId: string) => {
    if (currentTool !== 'bucket') return;
    setHistory(prevHistory => [...prevHistory, fills]);
    setFills(prevFills => ({ ...prevFills, [partId]: selectedColor }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastFills = history[history.length - 1];
    setFills(lastFills);
    setHistory(history.slice(0, -1));
  };

  const handleReset = () => {
    setFills({});
    setHistory([]);
    drawingRef.current?.clearCanvas();
  };

  const CurrentDrawing = drawingComponents[selectedDrawing];

  return (
    <div className="app-container">
      <aside className="drawing-selector">
        <DrawingSelector
          drawings={Object.keys(drawingComponents) as DrawingComponentType[]}
          selectedDrawing={selectedDrawing}
          onSelect={handleSelectDrawing}
        />
      </aside>
      <main className="coloring-canvas">
        <CurrentDrawing
          ref={drawingRef}
          key={selectedDrawing} // Add key to force re-mount and clear canvas on change
          fills={fills}
          onFill={handleFill}
          tool={currentTool}
          color={currentTool === 'eraser' ? '#FFFFFF' : selectedColor}
        />
      </main>
      <aside className="color-palette">
        <ColorPalette
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      </aside>
      <footer className="toolbar">
        <Toolbar
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          onUndo={handleUndo}
          onReset={handleReset}
        />
      </footer>
    </div>
  );
}

export default App;