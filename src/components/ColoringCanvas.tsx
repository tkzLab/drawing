import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useColoringCanvas } from '../hooks/useColoringCanvas';
import { overlayStyle, stageStyle } from './drawingStyles';
import { CanvasHandle, Tool } from '../types';

interface ColoringCanvasProps {
  tool: Tool;
  color: string;
}

// Blank free-drawing canvas for the おえかき mode (pen + eraser, no confinement).
const ColoringCanvas = forwardRef<CanvasHandle, ColoringCanvasProps>(({ tool, color }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onPointerDown, onPointerMove, onPointerUp, undo, clear } = useColoringCanvas({
    canvasRef,
    color,
    tool,
  });

  useImperativeHandle(ref, () => ({ undo, clear }), [undo, clear]);

  return (
    <div style={stageStyle}>
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
});

export default ColoringCanvas;
