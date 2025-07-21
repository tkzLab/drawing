import { useRef, useImperativeHandle, forwardRef } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import { DrawingHandle } from '../types';
import { Tool } from '../components/Toolbar';

interface CustomDrawingProps {
  imageUrl: string;
  tool: Tool;
  color: string;
}

const CustomDrawing = forwardRef<DrawingHandle, CustomDrawingProps>(
  ({ imageUrl, tool, color }, ref) => {
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
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img
          src={imageUrl}
          alt="Uploaded coloring page"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            touchAction: 'none',
            // The canvas should not block clicks, but for custom drawings, only brush/eraser are used,
            // so this is not strictly necessary as the bucket tool will be disabled.
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

export default CustomDrawing;
