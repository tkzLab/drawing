import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import { DrawingHandle } from '../types';
import { Tool } from '../components/Toolbar';

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
  tool: Tool;
  color: string;
}

const Car: React.FC<DrawingProps> = forwardRef<DrawingHandle, DrawingProps>(
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
          <g transform="translate(5, 20)">
            <path
              d="M 20,120 C 20,90 40,90 70,90 L 130,90 C 160,90 180,120 180,120 L 20,120 Z"
              stroke="#000" strokeWidth="3" fill={fills['car-body'] || '#FFF'}
              onClick={() => handlePartClick('car-body')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
            />
            <path
              d="M 50,90 L 70,60 L 130,60 L 150,90 L 50,90 Z"
              stroke="#000" strokeWidth="3" fill={fills['car-roof'] || '#FFF'}
              onClick={() => handlePartClick('car-roof')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
            />
            <circle
              cx="50" cy="120" r="20" stroke="#000" strokeWidth="3" fill={fills['wheel1'] || '#FFF'}
              onClick={() => handlePartClick('wheel1')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
            />
            <circle
              cx="150" cy="120" r="20" stroke="#000" strokeWidth="3" fill={fills['wheel2'] || '#FFF'}
              onClick={() => handlePartClick('wheel2')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
            />
          </g>
        </svg>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            touchAction: 'none',
            pointerEvents: tool === 'bucket' ? 'none' : 'auto',
          }}
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

export default Car;