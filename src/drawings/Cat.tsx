import { forwardRef } from 'react';
import { DrawingHandle } from '../types';
import { Tool } from '../components/Toolbar';
import DrawingCanvas from '../components/DrawingCanvas'; // Import the new component

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
  tool: Tool;
  color: string;
}

const Cat = forwardRef<DrawingHandle, DrawingProps>(
  ({ fills, onFill, tool, color }, ref) => {
    const handlePartClick = (partId: string) => {
      if (tool === 'bucket') {
        onFill(partId);
      }
    };

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* SVG paths for the cat drawing */}
          <path
            d="M 50,150 C 50,100 150,100 150,150 C 150,180 50,180 50,150 Z"
            stroke="#000" strokeWidth="3" fill={fills['cat-head'] || '#FFF'}
            onClick={() => handlePartClick('cat-head')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          <path
            d="M 50,105 C 40,80 70,80 70,105"
            stroke="#000" strokeWidth="3" fill={fills['cat-leftear'] || '#FFF'}
            onClick={() => handlePartClick('cat-leftear')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          <path
            d="M 150,105 C 160,80 130,80 130,105"
            stroke="#000" strokeWidth="3" fill={fills['cat-rightear'] || '#FFF'}
            onClick={() => handlePartClick('cat-rightear')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          <circle cx="85" cy="130" r="5" fill="#000" />
          <circle cx="115" cy="130" r="5" fill="#000" />
          <path d="M 100 140 C 95 150, 105 150, 100 140" fill="#000" />
          <path d="M 70 145 Q 50 140 30 145" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M 70 150 Q 50 150 30 150" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M 130 145 Q 150 140 170 145" stroke="#000" strokeWidth="1" fill="none" />
          <path d="M 130 150 Q 150 150 170 150" stroke="#000" strokeWidth="1" fill="none" />
        </svg>
        <DrawingCanvas ref={ref} tool={tool} color={color} />
      </div>
    );
  }
);

export default Cat;