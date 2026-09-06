import { useRef, useState } from 'react';
import '../App.css';
import '../components/DrawingSelector.css';
import ColorPalette from '../components/ColorPalette';
import ImageColoringCanvas from '../components/ImageColoringCanvas';
import Toolbar from '../components/Toolbar';
import { themes } from '../coloring/artworks';
import { Artwork, CanvasHandle, Paint, Theme, Tool } from '../types';

interface NurieScreenProps {
  onBackHome: () => void;
}

const NurieScreen: React.FC<NurieScreenProps> = ({ onBackHome }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [paint, setPaint] = useState<Paint>({ color: '#E60012', glitter: false });
  const [tool, setTool] = useState<Tool>('bucket');
  const [, bumpThumbs] = useState(0);
  const canvasRef = useRef<CanvasHandle>(null);

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
    setPickerOpen(false);
  };

  const picker = (
    <div className="art-picker-content">
      <header className="art-picker-header">
        {selectedArtwork ? (
          <h2>えをえらぶ</h2>
        ) : (
          <button className="picker-home" onClick={onBackHome}>← あそびをえらぶ</button>
        )}
        {selectedArtwork && (
          <button className="picker-close" onClick={() => setPickerOpen(false)} aria-label="絵選びを閉じる">
            × <span>とじる</span>
          </button>
        )}
      </header>
      <div className="theme-chips" aria-label="テーマをえらぶ">
        {themes.map(theme => (
          <button
            key={theme.id}
            className={selectedTheme?.id === theme.id ? 'active' : ''}
            onClick={() => setSelectedTheme(theme)}
            aria-pressed={selectedTheme?.id === theme.id}
          >
            {theme.name}
          </button>
        ))}
      </div>
      {selectedTheme ? (
        <div className="picker-art-grid" aria-label={`${selectedTheme.name}のぬりえ`}>
          {selectedTheme.artworks.map(artwork => (
            <button
              key={artwork.id}
              className={selectedArtwork?.id === artwork.id ? 'selected' : ''}
              onClick={() => selectArtwork(artwork)}
              aria-label={artwork.name}
            >
              <img src={thumbSrc(artwork.image)} alt={artwork.name} loading="eager" />
              <span>{artwork.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="picker-hint">テーマを えらんでね</p>
      )}
    </div>
  );

  return (
    <div className={`app-container ${selectedArtwork ? '' : 'no-artwork'}`}>
      {selectedArtwork ? (
        <aside className="drawing-selector drawing-selector--compact">
          <button className="art-picker-trigger" onClick={() => setPickerOpen(true)} aria-haspopup="dialog">
            <img src={thumbSrc(selectedArtwork.image)} alt="" />
            <span className="art-picker-trigger-name">{selectedArtwork.name}</span>
            <span className="art-picker-trigger-action">えをえらぶ</span>
          </button>
        </aside>
      ) : (
        <aside className="drawing-selector">{picker}</aside>
      )}
      {pickerOpen && <section className="art-picker-sheet" role="dialog" aria-modal="true">{picker}</section>}
      <main className="coloring-canvas">
        {selectedArtwork ? (
          <ImageColoringCanvas
            key={selectedArtwork.id}
            ref={canvasRef}
            tool={tool}
            paint={paint}
            image={selectedArtwork.image}
            onChange={() => bumpThumbs(n => n + 1)}
          />
        ) : (
          <div className="placeholder-text">ぬりえをえらんでね！</div>
        )}
      </main>
      <aside className="color-palette"><ColorPalette paint={paint} onPaintChange={setPaint} /></aside>
      <footer className="toolbar">
        <Toolbar
          tools={['bucket', 'brush', 'paintbrush', 'eraser']}
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
