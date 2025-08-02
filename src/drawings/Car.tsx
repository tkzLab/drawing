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

const Car = forwardRef<DrawingHandle, DrawingProps>(
  ({ fills, onFill, tool, color }, ref) => {
    const handlePartClick = (partId: string) => {
      if (tool === 'bucket') {
        onFill(partId);
      }
    };

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg viewBox="0 0 200 150" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* Car body */}
          <path
            d="M 20,90 C 10,70 40,60 180,60 C 190,80 170,90 20,90 Z"
            stroke="#000" strokeWidth="3" fill={fills['car-body'] || '#FFF'}
            onClick={() => handlePartClick('car-body')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          {/* Car roof */}
          <path
            d="M 50,60 C 60,30 140,30 150,60"
            stroke="#000" strokeWidth="3" fill={fills['car-roof'] || '#FFF'}
            onClick={() => handlePartClick('car-roof')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          {/* Wheels */}
          <circle
            cx="50" cy="90" r="15" stroke="#000" strokeWidth="3" fill={fills['car-wheel1'] || '#FFF'}
            onClick={() => handlePartClick('car-wheel1')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          <circle
            cx="150" cy="90" r="15" stroke="#000" strokeWidth="3" fill={fills['car-wheel2'] || '#FFF'}
            onClick={() => handlePartClick('car-wheel2')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
        </svg>
        <DrawingCanvas ref={ref} tool={tool} color={color} />
      </div>
    );
  }
);

export default Car;
