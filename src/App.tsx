import React, { useState, useRef } from 'react';
import './App.css';
import ColorPalette from './components/ColorPalette';
import Toolbar, { Tool } from './components/Toolbar';
import DrawingSelector from './components/DrawingSelector';
import CustomDrawing from './drawings/CustomDrawing'; // Import the new component
import { DrawingHandle, Theme } from './types';
import { themes } from './drawingData';

function App() {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [currentTool, setCurrentTool] = useState<Tool>('brush'); // Default to brush now
  
  const [selectionStep, setSelectionStep] = useState<'theme' | 'drawing' | 'custom'>('theme');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<React.FC<any> | null>(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [fills, setFills] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  
  const drawingRef = useRef<DrawingHandle>(null);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setSelectionStep('drawing');
  };

  const handleDrawingSelect = (drawingComponent: React.FC<any>, drawingId: string) => {
    setUploadedImage(null); // Clear any uploaded image
    setSelectedDrawing(() => drawingComponent);
    setSelectedDrawingId(drawingId);
    setCurrentTool('bucket'); // Default to bucket for pre-made drawings
    setFills({});
    setHistory([]);
  };

  const handleImageUpload = (dataUrl: string) => {
    setUploadedImage(dataUrl);
    setSelectionStep('custom');
    setCurrentTool('brush'); // Force brush tool for custom drawings
    setFills({});
    setHistory([]);
  };

  const handleBackToThemes = () => {
    setSelectionStep('theme');
    setSelectedTheme(null);
    setUploadedImage(null); // Clear uploaded image
    setSelectedDrawing(null);
    setSelectedDrawingId(null);
  };

  const handleFill = (partId: string) => {
    if (currentTool !== 'bucket' || uploadedImage) return;
    setHistory(prevHistory => [...prevHistory, fills]);
    setFills(prevFills => ({ ...prevFills, [partId]: selectedColor }));
  };

  const handleUndo = () => {
    if (uploadedImage) return; // Undo is disabled for custom drawings for now
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

  const isBucketDisabled = !!uploadedImage;
  const CurrentDrawingComponent = uploadedImage ? CustomDrawing : selectedDrawing;
  const drawingKey = uploadedImage ? 'custom-drawing' : selectedDrawingId;

  return (
    <div className="app-container">
      <aside className="drawing-selector">
        <DrawingSelector
          step={selectionStep}
          themes={themes}
          selectedTheme={selectedTheme}
          onThemeSelect={handleThemeSelect}
          onDrawingSelect={handleDrawingSelect}
          onImageUpload={handleImageUpload}
          onBack={handleBackToThemes}
        />
      </aside>
      <main className="coloring-canvas">
        {uploadedImage ? (
          <CustomDrawing
            ref={drawingRef}
            key="custom-drawing"
            tool={currentTool}
            color={currentTool === 'eraser' ? '#FFFFFF' : selectedColor}
            imageUrl={uploadedImage}
          />
        ) : selectedDrawing ? (
          React.createElement(selectedDrawing, {
            ref: drawingRef,
            key: selectedDrawingId,
            fills: fills,
            onFill: handleFill,
            tool: currentTool,
            color: currentTool === 'eraser' ? '#FFFFFF' : selectedColor,
          })
        ) : (
          <div className="placeholder-text">ぬりえをえらんでね！</div>
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
          isBucketDisabled={isBucketDisabled}
          isUndoDisabled={isBucketDisabled}
        />
      </footer>
    </div>
  );
}

export default App;