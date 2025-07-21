import React from 'react';

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
}

const Apple: React.FC<DrawingProps> = ({ fills, onFill }) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, -5)">
        {/* Apple Body */}
        <path
          d="M 100,60 C 140,60 160,90 160,120 C 160,170 130,190 100,190 C 70,190 40,170 40,120 C 40,90 60,60 100,60 Z"
          stroke="#000"
          strokeWidth="3"
          fill={fills['apple-body'] || '#FFF'}
          onClick={() => onFill('apple-body')}
        />
        {/* Apple Leaf */}
        <path
          d="M 110,60 Q 130,40 140,20 C 130,40 110,50 110,60"
          stroke="#000"
          strokeWidth="3"
          fill={fills['apple-leaf'] || '#FFF'}
          onClick={() => onFill('apple-leaf')}
        />
        {/* Apple Stem */}
        <path
          d="M 100,65 Q 100,45 105,30"
          stroke="#000"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default Apple;
