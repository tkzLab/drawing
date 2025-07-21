import React, { useState, useRef } from 'react';
import './App.css';
import ColorPalette from './components/ColorPalette';
import Toolbar, { Tool } from './components/Toolbar';
import DrawingSelector from './components/DrawingSelector';
import { DrawingHandle } from './types'; // Create a new types file
import { themes, Theme } from './drawingData'; // Create a new data file

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [currentTool, setCurrentTool] = useState<Tool>('bucket');
  
  // State for drawing selection flow
  const [selectionStep, setSelectionStep] = useState<'theme' | 'drawing'>('theme');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<React.FC<any> | null>(() => themes[0].drawings[0].component);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string>(() => themes[0].drawings[0].id);


  const [fills, setFills] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  
  const drawingRef = useRef<DrawingHandle>(null);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setSelectionStep('drawing');
  };

  const handleDrawingSelect = (drawingComponent: React.FC<any>, drawingId: string) => {
    setSelectedDrawing(() => drawingComponent);
    setSelectedDrawingId(drawingId);
    setFills({});
    setHistory([]);
  };

  const handleBackToThemes = () => {
    setSelectionStep('theme');
    setSelectedTheme(null);
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

  const CurrentDrawingComponent = selectedDrawing;

  return (
    <div className="app-container">
      <aside className="drawing-selector">
        <DrawingSelector
          step={selectionStep}
          themes={themes}
          selectedTheme={selectedTheme}
          onThemeSelect={handleThemeSelect}
          onDrawingSelect={handleDrawingSelect}
          onBack={handleBackToThemes}
        />
      </aside>
      <main className="coloring-canvas">
        {CurrentDrawingComponent && (
          <CurrentDrawingComponent
            ref={drawingRef}
            key={selectedDrawingId}
            fills={fills}
            onFill={handleFill}
            tool={currentTool}
            color={currentTool === 'eraser' ? '#FFFFFF' : selectedColor}
          />
        )}
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
