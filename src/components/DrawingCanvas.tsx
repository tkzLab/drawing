import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import { DrawingHandle } from '../types';
import { Tool } from './Toolbar';

interface DrawingCanvasProps {
  tool: Tool;
  color: string;
}

const DrawingCanvas = forwardRef<DrawingHandle, DrawingCanvasProps>(
  ({ tool, color }, ref) => {
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

    return (
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
          mixBlendMode: 'normal', // Correct blend mode is managed here
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    );
  }
);

export default DrawingCanvas;
