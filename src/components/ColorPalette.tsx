import React from 'react';
import './ColorPalette.css';

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
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <>
      {COLORS.map(color => (
        <button
          key={color}
          className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
          aria-label={`Color ${color}`}
        />
      ))}
    </>
  );
};

export default ColorPalette;
