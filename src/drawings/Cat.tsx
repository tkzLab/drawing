import React from 'react';

interface DrawingProps {
  fills: Record<string, string>;
  onFill: (partId: string) => void;
}

const Cat: React.FC<DrawingProps> = ({ fills, onFill }) => {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <path
        d="M 50,150 C 50,100 150,100 150,150 C 150,180 50,180 50,150 Z"
        stroke="#000"
        strokeWidth="3"
        fill={fills['cat-head'] || '#FFF'}
        onClick={() => onFill('cat-head')}
      />
      {/* Left Ear */}
      <path
        d="M 50,105 C 40,80 70,80 70,105"
        stroke="#000"
        strokeWidth="3"
        fill={fills['cat-leftear'] || '#FFF'}
        onClick={() => onFill('cat-leftear')}
      />
      {/* Right Ear */}
      <path
        d="M 150,105 C 160,80 130,80 130,105"
        stroke="#000"
        strokeWidth="3"
        fill={fills['cat-rightear'] || '#FFF'}
        onClick={() => onFill('cat-rightear')}
      />
      {/* Eyes */}
      <circle cx="85" cy="130" r="5" fill="#000" />
      <circle cx="115" cy="130" r="5" fill="#000" />
      {/* Nose */}
      <path d="M 100 140 C 95 150, 105 150, 100 140" fill="#000" />
      {/* Whiskers */}
      <path d="M 70 145 Q 50 140 30 145" stroke="#000" strokeWidth="1" fill="none" />
      <path d="M 70 150 Q 50 150 30 150" stroke="#000" strokeWidth="1" fill="none" />
      <path d="M 130 145 Q 150 140 170 145" stroke="#000" strokeWidth="1" fill="none" />
      <path d="M 130 150 Q 150 150 170 150" stroke="#000" strokeWidth="1" fill="none" />
    </svg>
  );
};

export default Cat;
