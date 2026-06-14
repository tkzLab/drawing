import { useRef, useState } from 'react';
import '../App.css';
import '../components/DrawingSelector.css';
import ColorPalette from '../components/ColorPalette';
import ColoringCanvas from '../components/ColoringCanvas';
import ImageUploadButton from '../components/ImageUploadButton';
import Toolbar from '../components/Toolbar';
import { CanvasHandle, Tool } from '../types';

interface OekakiScreenProps {
  onBackHome: () => void;
}

const OekakiScreen: React.FC<OekakiScreenProps> = ({ onBackHome }) => {
  const [color, setColor] = useState('#FF0000');
  const [tool, setTool] = useState<Tool>('brush');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const canvasRef = useRef<CanvasHandle>(null);

  return (
    <div className="app-container">
      <aside className="drawing-selector">
        <div className="selector-container">
          <button className="back-button" onClick={onBackHome}>
            ← ホームにもどる
          </button>
          <h2>じゆうに おえかき</h2>
          {backgroundImage && (
            <button className="back-button" onClick={() => setBackgroundImage(null)}>
              しろがみにする
            </button>
          )}
          <hr className="divider" />
          {/* For a grown-up: load a photo to draw on top of. */}
          <ImageUploadButton onImageUpload={setBackgroundImage} />
        </div>
      </aside>
      <main className="coloring-canvas">
        <ColoringCanvas
          key={backgroundImage ?? 'blank'}
          ref={canvasRef}
          tool={tool}
          color={color}
          backgroundImage={backgroundImage ?? undefined}
        />
      </main>
      <aside className="color-palette">
        <ColorPalette selectedColor={color} onSelectColor={setColor} />
      </aside>
      <footer className="toolbar">
        <Toolbar
          tools={['brush', 'eraser']}
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
