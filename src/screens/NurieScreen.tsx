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
  // 塗るたびに増やして、選択中のぬりえのサムネイルを塗り済み画像に再読込させる
  const [, bumpThumbs] = useState(0);

  const canvasRef = useRef<CanvasHandle>(null);

  // Show the child's saved coloring as the thumbnail (falls back to the blank
  // line art if they haven't colored it yet). Saved by useImageColoring.persist.
  const thumbSrc = (image: string | undefined) => {
    if (!image) return image;
    try {
      return localStorage.getItem(`nurie-thumb:v1:${image}`) ?? image;
    } catch {
      return image;
    }
  };

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
              <img className="thumb" src={thumbSrc(theme.artworks[0]?.image)} alt="" loading="lazy" />
              <span className="thumb-label">{theme.name}</span>
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
              aria-label={artwork.name}
            >
              <img className="thumb" src={thumbSrc(artwork.image)} alt={artwork.name} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${selectedArtwork ? '' : 'no-artwork'}`}>
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
          <ImageColoringCanvas
            key={selectedArtwork.id}
            ref={canvasRef}
            tool={tool}
            color={color}
            image={selectedArtwork.image}
            onChange={() => bumpThumbs(n => n + 1)}
          />
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
