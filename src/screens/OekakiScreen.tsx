import { useRef, useState } from 'react';
import '../App.css';
import '../components/DrawingSelector.css';
import ColorPalette from '../components/ColorPalette';
import ColoringCanvas from '../components/ColoringCanvas';
import ImageColoringCanvas from '../components/ImageColoringCanvas';
import ImageUploadButton from '../components/ImageUploadButton';
import Toolbar from '../components/Toolbar';
import { CanvasHandle, Tool } from '../types';

interface OekakiScreenProps {
  onBackHome: () => void;
}

const OekakiScreen: React.FC<OekakiScreenProps> = ({ onBackHome }) => {
  const [color, setColor] = useState('#FF0000');
  const [tool, setTool] = useState<Tool>('brush');
  const [loadedImage, setLoadedImage] = useState<string | null>(null);

  const canvasRef = useRef<CanvasHandle>(null);

  const handleUpload = (dataUrl: string) => {
    setLoadedImage(dataUrl);
    setTool('brush');
  };

  const handleBlank = () => {
    setLoadedImage(null);
    setTool('brush'); // bucket is only meaningful on a loaded line drawing
  };

  return (
    <div className="app-container">
      <aside className="drawing-selector">
        <div className="selector-container">
          <button className="back-button" onClick={onBackHome}>
            ← ホームにもどる
          </button>
          <h2>じゆうに おえかき</h2>
          {loadedImage && (
            <button className="back-button" onClick={handleBlank}>
              しろがみにする
            </button>
          )}
          <hr className="divider" />
          {/* Load a black-line drawing to color in (stays inside the lines). */}
          <ImageUploadButton onImageUpload={handleUpload} />
        </div>
      </aside>
      <main className="coloring-canvas">
        {loadedImage ? (
          <ImageColoringCanvas key={loadedImage} ref={canvasRef} tool={tool} color={color} image={loadedImage} />
        ) : (
          <ColoringCanvas ref={canvasRef} tool={tool} color={color} />
        )}
      </main>
      <aside className="color-palette">
        <ColorPalette selectedColor={color} onSelectColor={setColor} />
      </aside>
      <footer className="toolbar">
        <Toolbar
          tools={loadedImage ? ['bucket', 'brush', 'eraser'] : ['brush', 'eraser']}
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
