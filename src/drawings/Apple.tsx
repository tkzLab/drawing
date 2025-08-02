import { forwardRef } from 'react';
import { DrawingHandle } from '../types';
import { Tool } from '../components/Toolbar';
import DrawingCanvas from '../components/DrawingCanvas';

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
  tool: Tool;
  color: string;
}

const Apple = forwardRef<DrawingHandle, DrawingProps>(
  ({ fills, onFill, tool, color }, ref) => {
    const handlePartClick = (partId: string) => {
      if (tool === 'bucket') {
        onFill(partId);
      }
    };

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* Apple body */}
          <path
            d="M 100,100 C 50,100 50,150 100,150 C 150,150 150,100 100,100"
            stroke="#000" strokeWidth="3" fill={fills['apple-body'] || '#FFF'}
            onClick={() => handlePartClick('apple-body')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
          <path
            d="M 100,100 C 100,80 110,80 110,100"
            stroke="#000" strokeWidth="3" fill={fills['apple-leaf'] || '#FFF'}
            onClick={() => handlePartClick('apple-leaf')} cursor={tool === 'bucket' ? 'pointer' : 'default'}
          />
        </svg>
        <DrawingCanvas ref={ref} tool={tool} color={color} />
      </div>
    );
  }
);

export default Apple;
