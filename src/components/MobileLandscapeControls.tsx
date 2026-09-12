import ColorPalette from './ColorPalette';
import './MobileLandscapeControls.css';
import { Paint, Tool } from '../types';

type Panel = 'colors' | 'tools' | null;

interface MobileLandscapeControlsProps {
  panel: Panel;
  paint: Paint;
  tool: Tool;
  onPanelChange: (panel: Panel) => void;
  onPaintChange: (paint: Paint) => void;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onClear: () => void;
  onComplete: () => void;
}

const TOOL_ITEMS: { tool: Tool; label: string; icon: string }[] = [
  { tool: 'bucket', label: 'バケツ', icon: '🪣' },
  { tool: 'brush', label: 'ペン', icon: '✏️' },
  { tool: 'paintbrush', label: 'ブラシ', icon: '🖌️' },
  { tool: 'eraser', label: 'けしゴム', icon: '🧼' },
];

const MobileLandscapeControls: React.FC<MobileLandscapeControlsProps> = ({
  panel,
  paint,
  tool,
  onPanelChange,
  onPaintChange,
  onToolChange,
  onUndo,
  onClear,
  onComplete,
}) => {
  const selectTool = (nextTool: Tool) => {
    onToolChange(nextTool);
    onPanelChange(null);
  };

  const selectPaint = (nextPaint: Paint) => {
    onPaintChange(nextPaint);
    onPanelChange(null);
  };

  return (
    <div className="mobile-landscape-controls">
      {panel === null ? (
        <div className="mobile-landscape-dock" aria-label="いろとどうぐ">
          <button
            type="button"
            className="mobile-current-color"
            style={{ backgroundColor: paint.color }}
            onClick={() => onPanelChange('colors')}
            aria-label="いろをえらぶ"
          />
          <button type="button" className="mobile-dock-button" onClick={() => onPanelChange('colors')}>
            <span aria-hidden="true">🎨</span><span>いろ</span>
          </button>
          <button type="button" className="mobile-dock-button mobile-dock-button--tool" onClick={() => onPanelChange('tools')}>
            <span aria-hidden="true">🖍️</span><span>どうぐ</span>
          </button>
        </div>
      ) : (
        <section className={`mobile-landscape-sheet mobile-landscape-sheet--${panel}`} aria-label={panel === 'colors' ? 'いろをえらぶ' : 'どうぐをえらぶ'}>
          <button type="button" className="mobile-sheet-close" onClick={() => onPanelChange(null)} aria-label="パネルをとじる">⌄</button>
          {panel === 'colors' ? (
            <div className="mobile-color-list">
              <ColorPalette paint={paint} onPaintChange={selectPaint} />
            </div>
          ) : (
            <>
              <div className="mobile-tool-list">
                {TOOL_ITEMS.map(item => (
                  <button
                    key={item.tool}
                    type="button"
                    className={`mobile-tool-button ${tool === item.tool ? 'is-current' : ''}`}
                    onClick={() => selectTool(item.tool)}
                    aria-pressed={tool === item.tool}
                  >
                    <span aria-hidden="true">{item.icon}</span><span>{item.label}</span>
                  </button>
                ))}
              </div>
              <div className="mobile-sheet-actions">
                <button type="button" onClick={onUndo}>↩ もどす</button>
                <button type="button" onClick={onClear}>🗑️ ぜんぶけす</button>
                <button type="button" className="mobile-sheet-complete" onClick={onComplete}>★ できた！</button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default MobileLandscapeControls;
