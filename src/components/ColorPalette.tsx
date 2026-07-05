import React from 'react';
import './ColorPalette.css';
import { Paint } from '../types';

const COLORS = [
  // あか〜ピンク系
  '#FF0000', '#E60050', '#FF5C8A', '#FFC0CB',
  // オレンジ〜きいろ系
  '#FF6F00', '#FFA500', '#FFD400', '#FFFF00',
  // みどり系
  '#9ACD32', '#00C853', '#008000', '#006400',
  // みず〜あお系
  '#00FFFF', '#00B0FF', '#0000FF', '#1A237E',
  // むらさき系
  '#8E24AA', '#800080', '#B388FF',
  // ちゃ〜はだ系
  '#A52A2A', '#8D5524', '#FFDBAC',
  // モノクロ系
  '#000000', '#808080', '#C0C0C0', '#FFFFFF'
];

interface ColorPaletteProps {
  paint: Paint;
  onPaintChange: (paint: Paint) => void;
}

// The color rail. The ✨ toggle turns any selected color into glitter, so the
// swatches preview a sparkle overlay while it is on.
const ColorPalette: React.FC<ColorPaletteProps> = ({ paint, onPaintChange }) => {
  return (
    <>
      <button
        className={`glitter-toggle ${paint.glitter ? 'active' : ''}`}
        onClick={() => onPaintChange({ ...paint, glitter: !paint.glitter })}
        aria-pressed={paint.glitter}
      >
        <span aria-hidden="true">✨</span>
        <span className="glitter-toggle-label">キラキラ</span>
      </button>
      {COLORS.map(color => (
        <button
          key={color}
          className={`color-swatch ${paint.color === color ? 'selected' : ''} ${
            paint.glitter ? 'glitter' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onPaintChange({ ...paint, color })}
          aria-label={`Color ${color}`}
        />
      ))}
    </>
  );
};

export default ColorPalette;
