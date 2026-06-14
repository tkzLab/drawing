import { useEffect, useRef } from 'react';
import { Tool } from '../types';

const LINE_WIDTH = 12;
const MAX_HISTORY = 25;

interface Params {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  color: string;
  tool: Tool;
}

// Free-drawing canvas for the おえかき mode: pen + eraser with a consistent
// undo history. (No bucket — that lives in the image-based ぬりえ canvas.)
export const useColoringCanvas = ({ canvasRef, color, tool }: Params) => {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isStrokingRef = useRef(false);
  const historyRef = useRef<ImageData[]>([]);

  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  toolRef.current = tool;
  colorRef.current = color;

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = LINE_WIDTH;
    ctxRef.current = ctx;
    historyRef.current = [];
  };

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  const snapshot = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || canvas.width === 0) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
  };

  const getPos = (e: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const pos = getPos(e.nativeEvent);
    if (!pos) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);

    snapshot();
    ctx.globalCompositeOperation = toolRef.current === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = colorRef.current;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    isStrokingRef.current = true;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isStrokingRef.current) return;
    const ctx = ctxRef.current;
    const pos = getPos(e.nativeEvent);
    if (!ctx || !pos) return;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    isStrokingRef.current = false;
  };

  const undo = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const prev = historyRef.current.pop();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (prev && prev.width === canvas.width && prev.height === canvas.height) {
      ctx.putImageData(prev, 0, 0);
    }
  };

  const clear = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    snapshot();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return { onPointerDown, onPointerMove, onPointerUp, undo, clear };
};
