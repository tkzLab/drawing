import React from 'react';

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
}

const Car: React.FC<DrawingProps> = ({ fills, onFill }) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(5, 20)">
        {/* Car Body */}
        <path
          d="M 20,120 C 20,90 40,90 70,90 L 130,90 C 160,90 180,120 180,120 L 20,120 Z"
          stroke="#000"
          strokeWidth="3"
          fill={fills['car-body'] || '#FFF'}
          onClick={() => onFill('car-body')}
        />
        {/* Car Roof */}
        <path
          d="M 50,90 L 70,60 L 130,60 L 150,90 L 50,90 Z"
          stroke="#000"
          strokeWidth="3"
          fill={fills['car-roof'] || '#FFF'}
          onClick={() => onFill('car-roof')}
        />
        {/* Wheel 1 */}
        <circle
          cx="50"
          cy="120"
          r="20"
          stroke="#000"
          strokeWidth="3"
          fill={fills['wheel1'] || '#FFF'}
          onClick={() => onFill('wheel1')}
        />
        {/* Wheel 2 */}
        <circle
          cx="150"
          cy="120"
          r="20"
          stroke="#000"
          strokeWidth="3"
          fill={fills['wheel2'] || '#FFF'}
          onClick={() => onFill('wheel2')}
        />
      </g>
    </svg>
  );
};

export default Car;
