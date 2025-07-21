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

const Apple = forwardRef<DrawingHandle, DrawingProps>(
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
          <g transform="translate(0, -5)">
            <path
              d="M 100,60 C 140,60 160,90 160,120 C 160,170 130,190 100,190 C 70,190 40,170 40,120 C 40,90 60,60 100,60 Z"
              stroke="#000" strokeWidth="3" fill={fills['apple-body'] || '#FFF'}
              onClick={() => handlePartClick('apple-body')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
            />
            <path
              d="M 110,60 Q 130,40 140,20 C 130,40 110,50 110,60"
              stroke="#000" strokeWidth="3" fill={fills['apple-leaf'] || '#FFF'}
              onClick={() => handlePartClick('apple-leaf')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
            />
            <path d="M 100,65 Q 100,45 105,30" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
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

export default Apple;