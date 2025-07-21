import React, { useState } from 'react';
import './App.css';
import ColorPalette from './components/ColorPalette';
import Toolbar from './components/Toolbar';
import DrawingSelector from './components/DrawingSelector';
import Apple from './drawings/Apple';
import Car from './drawings/Car';
import Cat from './drawings/Cat';

// Define a type for our drawing components for better type safety
type DrawingComponentType = 'apple' | 'car' | 'cat';

const drawingComponents: Record<DrawingComponentType, React.FC<any>> = {
  apple: Apple,
  car: Car,
  cat: Cat,
};

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingComponentType>('apple');
  const [fills, setFills] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);

  const handleSelectDrawing = (drawing: DrawingComponentType) => {
    setSelectedDrawing(drawing);
    setFills({});
    setHistory([]);
  };

  const handleFill = (partId: string) => {
    // Save current state to history before updating
    setHistory(prevHistory => [...prevHistory, fills]);
    // Set the new fill color
    setFills(prevFills => ({ ...prevFills, [partId]: selectedColor }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    // Get the last state from history
    const lastFills = history[history.length - 1];
    // Restore the fills to the last state
    setFills(lastFills);
    // Remove the last state from history
    setHistory(history.slice(0, -1));
  };

  const handleReset = () => {
    setFills({});
    setHistory([]);
  };

  // The component to render, selected statically
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
        {/* Ensure a key is present if you were to list multiple drawings */}
        <CurrentDrawing fills={fills} onFill={handleFill} />
      </main>
      <aside className="color-palette">
        <ColorPalette
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      </aside>
      <footer className="toolbar">
        <Toolbar onUndo={handleUndo} onReset={handleReset} />
      </footer>
    </div>
  );
}

export default App;
