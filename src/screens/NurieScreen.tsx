import { useRef, useState } from 'react';
import '../App.css';
import '../components/DrawingSelector.css';
import ColorPalette from '../components/ColorPalette';
import ImageColoringCanvas from '../components/ImageColoringCanvas';
import Toolbar from '../components/Toolbar';
import { themes } from '../coloring/artworks';
import { Artwork, CanvasHandle, Theme, Tool } from '../types';

interface NurieScreenProps {
  onBackHome: () => void;
}

const NurieScreen: React.FC<NurieScreenProps> = ({ onBackHome }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [color, setColor] = useState('#FF0000');
  const [tool, setTool] = useState<Tool>('bucket');
  // スマホ縦で上部メニューをたたんでキャンバスを広げられるように
  const [menuOpen, setMenuOpen] = useState(true);

  const canvasRef = useRef<CanvasHandle>(null);

  const selectArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setTool('bucket');
    setMenuOpen(false); // 選んだら自動でたたんで塗るスペースを広げる
  };

  let selector;
  if (!selectedTheme) {
    selector = (
      <div className="selector-container">
        <button className="back-button" onClick={onBackHome}>
          ← ホームにもどる
        </button>
        <h2>テーマをえらんでね</h2>
        <div className="button-grid">
          {themes.map(theme => (
            <button key={theme.id} className="theme-button" onClick={() => setSelectedTheme(theme)}>
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    selector = (
      <div className="selector-container">
        <button
          className="back-button"
          onClick={() => {
            setSelectedTheme(null);
            setSelectedArtwork(null);
            setMenuOpen(true);
          }}
        >
          ← テーマにもどる
        </button>
        <h2>ぬりえをえらんでね</h2>
        <div className="button-grid">
          {selectedTheme.artworks.map(artwork => (
            <button
              key={artwork.id}
              className={`drawing-button ${selectedArtwork?.id === artwork.id ? 'selected' : ''}`}
              onClick={() => selectArtwork(artwork)}
            >
              {artwork.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className={`drawing-selector ${menuOpen ? '' : 'collapsed'}`}>
        {selectedArtwork && (
          <button
            className="selector-toggle"
            onClick={() => setMenuOpen(open => !open)}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '▲ メニューをとじる' : `▼ ${selectedArtwork.name}をかえる`}
          </button>
        )}
        <div className="selector-body">{selector}</div>
      </aside>
      <main className="coloring-canvas">
        {selectedArtwork ? (
          <ImageColoringCanvas key={selectedArtwork.id} ref={canvasRef} tool={tool} color={color} image={selectedArtwork.image} />
        ) : (
          <div className="placeholder-text">ぬりえをえらんでね！</div>
        )}
      </main>
      <aside className="color-palette">
        <ColorPalette selectedColor={color} onSelectColor={setColor} />
      </aside>
      <footer className="toolbar">
        <Toolbar
          tools={['bucket', 'brush', 'eraser']}
          currentTool={tool}
          onToolChange={setTool}
          onUndo={() => canvasRef.current?.undo()}
          onClear={() => canvasRef.current?.clear()}
        />
      </footer>
    </div>
  );
};

export default NurieScreen;
