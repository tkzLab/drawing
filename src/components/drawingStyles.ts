import type { CSSProperties } from 'react';

// The relatively-positioned container that stacks the artwork and the canvas.
export const stageStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

// A layer (svg / canvas / image) that fills the stage on top of the others.
export const overlayStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};
