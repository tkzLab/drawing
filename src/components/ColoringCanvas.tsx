import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useColoringCanvas } from '../hooks/useColoringCanvas';
import { overlayStyle, stageStyle } from './drawingStyles';
import { CanvasHandle, Tool } from '../types';

interface ColoringCanvasProps {
  tool: Tool;
  color: string;
  // Optional background to draw on top of (e.g. an uploaded photo).
  backgroundImage?: string;
}

// Free-drawing canvas for the おえかき mode: an optional background image with a
// transparent drawing canvas on top.
const ColoringCanvas = forwardRef<CanvasHandle, ColoringCanvasProps>(
  ({ tool, color, backgroundImage }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { onPointerDown, onPointerMove, onPointerUp, undo, clear } = useColoringCanvas({
      canvasRef,
      color,
      tool,
    });

    useImperativeHandle(ref, () => ({ undo, clear }), [undo, clear]);

    return (
      <div style={stageStyle}>
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Uploaded coloring page"
            style={{ ...overlayStyle, objectFit: 'contain' }}
          />
        )}
        <canvas
          ref={canvasRef}
          style={{ ...overlayStyle, touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
    );
  }
);

export default ColoringCanvas;
