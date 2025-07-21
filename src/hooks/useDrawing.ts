import { useEffect, useRef, useState } from 'react';

export const useDrawing = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  color: string,
  tool: 'brush' | 'eraser'
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 10; // Medium brush size
    contextRef.current = context;
  }, [canvasRef]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    }
  }, [color, tool]);

  const getCoords = (event: MouseEvent | TouchEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    if (event.touches[0]) {
      return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'brush' || tool === 'eraser') {
      const { x, y } = getCoords(event.nativeEvent);
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(event.nativeEvent);
    contextRef.current?.lineTo(x, y);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  return {
    startDrawing,
    draw,
    stopDrawing,
  };
};
