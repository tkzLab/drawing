import { forwardRef, useImperativeHandle, useRef } from 'react';
import './ImageColoringCanvas.css';
import { useImageColoring } from '../hooks/useImageColoring';
import { CanvasHandle, Tool } from '../types';

interface ImageColoringCanvasProps {
  image: string;
  tool: Tool;
  color: string;
}

// Two stacked canvases sized to the line-art image: the bottom holds the colors
// (bucket flood-fill + pen + eraser), the top shows the black outline so the
// lines always stay crisp above the colors.
const ImageColoringCanvas = forwardRef<CanvasHandle, ImageColoringCanvasProps>(
  ({ image, tool, color }, ref) => {
    const colorRef = useRef<HTMLCanvasElement>(null);
    const lineRef = useRef<HTMLCanvasElement>(null);
    const { onPointerDown, onPointerMove, onPointerUp, undo, clear } = useImageColoring({
      colorRef,
      lineRef,
      image,
      tool,
      color,
    });

    useImperativeHandle(ref, () => ({ undo, clear }), [undo, clear]);

    return (
      <div className="image-stage">
        <canvas
          ref={colorRef}
          className="image-layer image-layer--color"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <canvas ref={lineRef} className="image-layer image-layer--line" />
      </div>
    );
  }
);

export default ImageColoringCanvas;
