import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import { DrawingHandle } from '../App';
import { Tool } from '../components/Toolbar';

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
  tool: Tool;
  color: string;
}

const Cat: React.FC<DrawingProps> = forwardRef<DrawingHandle, DrawingProps>(
  ({ fills, onFill, tool, color }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { startDrawing, draw, stopDrawing } = useDrawing(canvasRef, color, tool as 'brush' | 'eraser');

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      },
    }));

    const handlePartClick = (partId: string) => {
      if (tool === 'bucket') {
        onFill(partId);
      }
    };

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
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
        <canvas
          ref={canvasRef}
          width="800"
          height="600"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    );
  }
);

export default Cat;