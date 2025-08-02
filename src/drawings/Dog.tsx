import { forwardRef } from 'react';
import { DrawingHandle } from '../types';
import { Tool } from '../components/Toolbar';
import DrawingCanvas from '../components/DrawingCanvas';

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
  tool: Tool;
  color: string;
}

const Dog = forwardRef<DrawingHandle, DrawingProps>(
  ({ fills, onFill, tool, color }, ref) => {
    const handlePartClick = (partId: string) => {
      if (tool === 'bucket') {
        onFill(partId);
      }
    };

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* Head */}
          <path
            d="M100,50 C140,50 160,80 160,110 C160,140 120,160 100,160 C80,160 40,140 40,110 C40,80 60,50 100,50 Z"
            stroke="#000" strokeWidth="3" fill={fills['dog-head'] || '#FFF'}
            onClick={() => handlePartClick('dog-head')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          {/* Left Ear */}
          <path
            d="M60,55 C40,30 80,40 60,80"
            stroke="#000" strokeWidth="3" fill={fills['dog-leftear'] || '#FFF'}
            onClick={() => handlePartClick('dog-leftear')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          {/* Right Ear */}
          <path
            d="M140,55 C160,30 120,40 140,80"
            stroke="#000" strokeWidth="3" fill={fills['dog-rightear'] || '#FFF'}
            onClick={() => handlePartClick('dog-rightear')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          {/* Eyes */}
          <circle cx="85" cy="100" r="5" fill="#000" />
          <circle cx="115" cy="100" r="5" fill="#000" />
          {/* Nose */}
          <path d="M100,120 C90,135 110,135 100,120 Z" fill="#000" />
        </svg>
        <DrawingCanvas ref={ref} tool={tool} color={color} />
      </div>
    );
  }
);

export default Dog;