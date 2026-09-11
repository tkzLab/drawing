import { useRef, useState } from 'react';
import '../App.css';
import '../components/DrawingSelector.css';
import ColorPalette from '../components/ColorPalette';
import ColoringCanvas from '../components/ColoringCanvas';
import FloatingBackButton from '../components/FloatingBackButton';
import Toolbar from '../components/Toolbar';
import { CanvasHandle, Paint, Tool } from '../types';

interface OekakiScreenProps {
  onBackHome: () => void;
}

const OekakiScreen: React.FC<OekakiScreenProps> = ({ onBackHome }) => {
  const [paint, setPaint] = useState<Paint>({ color: '#E60012', glitter: false });
  const [tool, setTool] = useState<Tool>('brush');

  const canvasRef = useRef<CanvasHandle>(null);

  return (
    <div className="app-container oekaki-workspace">
      <FloatingBackButton onClick={onBackHome} />
      <main className="coloring-canvas">
        <ColoringCanvas ref={canvasRef} tool={tool} paint={paint} />
      </main>
      <aside className="color-palette">
        <ColorPalette paint={paint} onPaintChange={setPaint} />
      </aside>
      <footer className="toolbar">
        <Toolbar
          tools={['brush', 'paintbrush', 'eraser']}
          currentTool={tool}
          onToolChange={setTool}
          onUndo={() => canvasRef.current?.undo()}
          onClear={() => canvasRef.current?.clear()}
        />
      </footer>
    </div>
  );
};

export default OekakiScreen;
