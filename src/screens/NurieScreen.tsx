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
  const [completeOpen, setCompleteOpen] = useState(false);
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
  };

  const chooseNextArtwork = () => {
    setCompleteOpen(false);
    setSelectedArtwork(null);
  };

  if (!selectedTheme) {
    return (
      <section className="nurie-picker-page nurie-theme-page" aria-label="テーマをえらぶ">
        <header className="nurie-picker-header">
          <button type="button" className="nurie-back-button" onClick={onBackHome}>← あそびをえらぶ</button>
          <h1>ぬりえ</h1>
        </header>
        <main className="nurie-picker-main">
          <h2>どれで あそぶ？</h2>
          <p>すきな えを ひとつ おしてね</p>
          <div className="theme-card-grid">
            {themes.map(theme => (
              <button
                key={theme.id}
                type="button"
                className={`theme-picture-card theme-picture-card--${theme.id}`}
                onClick={() => setSelectedTheme(theme)}
                aria-label={`${theme.name}のぬりえをえらぶ`}
              >
                <img src={thumbSrc(theme.artworks[0]?.image)} alt="" />
                <span>{theme.name}</span>
              </button>
            ))}
          </div>
        </main>
      </section>
    );
  }

  if (!selectedArtwork) {
    return (
      <section className="nurie-picker-page nurie-artwork-page" aria-label={`${selectedTheme.name}のぬりえをえらぶ`}>
        <header className="nurie-picker-header">
          <button type="button" className="nurie-back-button" onClick={() => setSelectedTheme(null)}>← テーマをえらぶ</button>
          <h1>{selectedTheme.name}の ぬりえ</h1>
        </header>
        <main className="nurie-picker-main">
          <h2>すきな えを おしてね</h2>
          <div className="artwork-card-grid">
            {selectedTheme.artworks.map(artwork => (
              <button key={artwork.id} type="button" className="artwork-picture-card" onClick={() => selectArtwork(artwork)}>
                <img src={thumbSrc(artwork.image)} alt="" loading="eager" />
                <span>{artwork.name}</span>
              </button>
            ))}
          </div>
        </main>
      </section>
    );
  }

  return (
    <div className="app-container nurie-workspace">
      <main className="coloring-canvas">
        <button type="button" className="canvas-picker-back" onClick={() => setSelectedArtwork(null)}>← えをえらぶ</button>
        <div className="canvas-stage-wrapper">
          <ImageColoringCanvas
            key={selectedArtwork.id}
            ref={canvasRef}
            tool={tool}
            paint={paint}
            image={selectedArtwork.image}
            onChange={() => bumpThumbs(n => n + 1)}
          />
        </div>
      </main>
      <aside className="color-palette" aria-label="いろをえらぶ">
        <ColorPalette paint={paint} onPaintChange={setPaint} />
      </aside>
      <footer className="toolbar">
        <Toolbar
          tools={['bucket', 'brush', 'paintbrush', 'eraser']}
          currentTool={tool}
          onToolChange={setTool}
          onUndo={() => canvasRef.current?.undo()}
          onClear={() => canvasRef.current?.clear()}
          onZoomIn={() => canvasRef.current?.zoomIn()}
          onZoomOut={() => canvasRef.current?.zoomOut()}
          onResetZoom={() => canvasRef.current?.resetZoom()}
          onComplete={() => setCompleteOpen(true)}
        />
      </footer>
      {completeOpen && (
        <section className="complete-overlay" role="dialog" aria-modal="true" aria-labelledby="complete-title">
          <div className="complete-popup">
            <button type="button" className="complete-close" onClick={() => setCompleteOpen(false)} aria-label="できたポップアップをとじる">×</button>
            <div className="complete-star" aria-hidden="true">★</div>
            <h2 id="complete-title">できた！</h2>
            <button type="button" className="complete-next" onClick={chooseNextArtwork}>つぎの ぬりえ</button>
            <button type="button" className="complete-end" onClick={onBackHome}>あそびを おわる</button>
          </div>
        </section>
      )}
    </div>
  );
};

export default NurieScreen;
