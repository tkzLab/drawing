import React from 'react';
import './ColorPalette.css';

const COLORS = [
  '#FF0000', '#0000FF', '#FFFF00', '#008000', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#000000', '#FFFFFF', '#808080', '#00FFFF'
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
