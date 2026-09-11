import { forwardRef, useCallback, useImperativeHandle, useRef, useState, type PointerEvent } from 'react';
import './ImageColoringCanvas.css';
import { useImageColoring } from '../hooks/useImageColoring';
import { CanvasHandle, Paint, Tool } from '../types';

interface ImageColoringCanvasProps {
  image: string;
  tool: Tool;
  paint: Paint;
  onChange?: () => void;
}

// Two stacked canvases sized to the line-art image: the bottom holds the colors
// (bucket flood-fill + pen + eraser), the top shows the black outline so the
// lines always stay crisp above the colors.
const ImageColoringCanvas = forwardRef<CanvasHandle, ImageColoringCanvasProps>(
  ({ image, tool, paint, onChange }, ref) => {
    const colorRef = useRef<HTMLCanvasElement>(null);
    const lineRef = useRef<HTMLCanvasElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const pointersRef = useRef(new Map<number, { x: number; y: number }>());
    const panningRef = useRef(false);
    const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const { onPointerDown, onPointerMove, onPointerUp, undo, clear } = useImageColoring({
      colorRef,
      lineRef,
      image,
      tool,
      paint,
      onChange,
    });

    const clampPan = useCallback((next: { x: number; y: number }, scale = zoom) => {
      const stage = stageRef.current;
      if (!stage || scale <= 1) return { x: 0, y: 0 };
      const maxX = ((scale - 1) * stage.clientWidth) / 2;
      const maxY = ((scale - 1) * stage.clientHeight) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, next.x)),
        y: Math.max(-maxY, Math.min(maxY, next.y)),
      };
    }, [zoom]);

    const zoomTo = useCallback((nextZoom: number) => {
      const next = Math.max(1, Math.min(3, nextZoom));
      setZoom(next);
      setPan(current => clampPan(current, next));
    }, [clampPan]);

    useImperativeHandle(ref, () => ({
      undo,
      clear,
      zoomIn: () => zoomTo(zoom + 0.5),
      zoomOut: () => zoomTo(zoom - 0.5),
      resetZoom: () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      },
    }), [undo, clear, zoom, zoomTo]);

    const pointerPosition = (event: PointerEvent<HTMLCanvasElement>) => ({
      x: event.clientX,
      y: event.clientY,
    });

    const onCanvasPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
      pointersRef.current.set(event.pointerId, pointerPosition(event));
      event.currentTarget.setPointerCapture?.(event.pointerId);

      if (zoom > 1 && pointersRef.current.size === 2) {
        panningRef.current = true;
        const points = [...pointersRef.current.values()];
        panStartRef.current = {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2,
          panX: pan.x,
          panY: pan.y,
        };
        onPointerUp();
        return;
      }

      if (!panningRef.current) onPointerDown(event);
    };

    const onCanvasPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
      if (!pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, pointerPosition(event));
      if (panningRef.current && pointersRef.current.size >= 2) {
        const points = [...pointersRef.current.values()];
        const centerX = (points[0].x + points[1].x) / 2;
        const centerY = (points[0].y + points[1].y) / 2;
        setPan(clampPan({
          x: panStartRef.current.panX + centerX - panStartRef.current.x,
          y: panStartRef.current.panY + centerY - panStartRef.current.y,
        }));
        return;
      }
      onPointerMove(event);
    };

    const onCanvasPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
      pointersRef.current.delete(event.pointerId);
      if (panningRef.current) {
        if (pointersRef.current.size < 2) panningRef.current = false;
        return;
      }
      onPointerUp();
    };

    return (
      <div className="image-stage-viewport">
        <div
          ref={stageRef}
          className="image-stage image-stage--paper"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <canvas
            ref={colorRef}
            className="image-layer image-layer--color"
            onPointerDown={onCanvasPointerDown}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
            onPointerLeave={onCanvasPointerUp}
            onPointerCancel={onCanvasPointerUp}
          />
          <canvas ref={lineRef} className="image-layer image-layer--line" />
        </div>
      </div>
    );
  }
);

export default ImageColoringCanvas;
