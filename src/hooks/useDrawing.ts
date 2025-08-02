import { useEffect, useRef, useState } from 'react';

export const useDrawing = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  color: string,
  tool: 'brush' | 'eraser'
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Function to set canvas dimensions
  const setCanvasDimensions = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    // Re-apply context settings after resize
    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = 10;
      context.strokeStyle = color;
      context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      contextRef.current = context;
    }
  };

  // Effect to set initial dimensions and handle resize
  useEffect(() => {
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [canvasRef]); // Run only when canvas ref changes

  // Effect to update drawing style when color or tool changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    }
  }, [tool]);

  const getCoords = (event: MouseEvent | TouchEvent): { x: number, y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return null;
    }
    
    return { 
      x: clientX - rect.left, 
      y: clientY - rect.top 
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (tool !== 'brush' && tool !== 'eraser') return;
    const coords = getCoords(event.nativeEvent);
    if (!coords) return;
    const { x, y } = coords;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoords(event.nativeEvent);
    if (!coords) return;
    const { x, y } = coords;
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