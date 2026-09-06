import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useColoringCanvas } from '../hooks/useColoringCanvas';
import { overlayStyle, stageStyle } from './drawingStyles';
import { CanvasHandle, Paint, Tool } from '../types';

interface ColoringCanvasProps {
  tool: Tool;
  paint: Paint;
}

// Blank free-drawing canvas for the おえかき mode (pen + eraser, no confinement).
const ColoringCanvas = forwardRef<CanvasHandle, ColoringCanvasProps>(({ tool, paint }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onPointerDown, onPointerMove, onPointerUp, undo, clear } = useColoringCanvas({
    canvasRef,
    paint,
    tool,
  });

  // Zoom controls are only shown in ぬりえ. Keep the common handle shape so
  // おえかき remains independent from that optional feature.
  useImperativeHandle(ref, () => ({ undo, clear, zoomIn: () => {}, zoomOut: () => {}, resetZoom: () => {} }), [undo, clear]);

  return (
    <div className="free-stage" style={stageStyle}>
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
