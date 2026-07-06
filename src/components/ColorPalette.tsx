import React from 'react';
import './ColorPalette.css';
import { Paint } from '../types';

// 色鉛筆36色セット準拠。全ペアの RGB 距離 49 以上（ほぼ同色の重複なし）を
// 機械検証済み。きんいろ・ぎんいろは きいろ/ぎんいろ×キラキラ で表現する。
const COLORS = [
  // あか〜ピンク系
  '#E60012', '#E8491F', '#B22222', '#FF8A65',
  '#F06292', '#F9A8C2', '#D5006D', '#880E4F',
  // だいだい〜きいろ系
  '#F28C00', '#FFB74D', '#FFBC00', '#FFF100',
  '#FAF489', '#FCDCBB',
  // アース系
  '#B8860B', '#9C9C4E', '#8B4513', '#57371A',
  // みどり系
  '#D4E157', '#9CCC2E', '#C5E1A5', '#00A047',
  '#1B5E20', '#80CBC4', '#00BFA5',
  // みず〜あお系
  '#B3E5FC', '#4FC3F7', '#1976D2', '#5C6BC0', '#283593',
  // むらさき系
  '#B39DDB', '#7B1FA2',
  // モノクロ系
  '#FFFFFF', '#C9CCD1', '#808A93', '#000000'
];

interface ColorPaletteProps {
  paint: Paint;
  onPaintChange: (paint: Paint) => void;
}

// The color rail. The ✨ toggle turns any selected color into glitter, so the
// swatches preview a sparkle overlay while it is on. The toggle is a bar shaped
// unlike the round swatches, pinned (sticky) at the scroll edge so it never
// hides even if the palette overflows on short screens.
const ColorPalette: React.FC<ColorPaletteProps> = ({ paint, onPaintChange }) => {
  return (
    <>
      {/* DOMでは先頭(縦持ちで左端sticky)、横向きレールではCSSのorderで最下部へ */}
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
