import React from 'react';
import './DrawingSelector.css';
import { Theme, Drawing } from '../types';

interface DrawingSelectorProps {
  step: 'theme' | 'drawing';
  themes: Theme[];
  selectedTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
  onDrawingSelect: (drawingComponent: React.FC<any>, drawingId: string) => void;
  onBack: () => void;
}

const DrawingSelector: React.FC<DrawingSelectorProps> = ({
  step,
  themes,
  selectedTheme,
  onThemeSelect,
  onDrawingSelect,
  onBack,
}) => {
  if (step === 'theme') {
    return (
      <div className="selector-container">
        <h2>テーマをえらんでね</h2>
        <div className="button-grid">
          {themes.map(theme => (
            <button key={theme.id} className="theme-button" onClick={() => onThemeSelect(theme)}>
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'drawing' && selectedTheme) {
    return (
      <div className="selector-container">
        <button className="back-button" onClick={onBack}>
          テーマにもどる
        </button>
        <h2>ぬりえをえらんでね</h2>
        <div className="button-grid">
          {selectedTheme.drawings.map((drawing: Drawing) => (
            <button
              key={drawing.id}
              className="drawing-button"
              onClick={() => onDrawingSelect(drawing.component, drawing.id)}
            >
              {drawing.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null; // Should not happen
};

export default DrawingSelector;
