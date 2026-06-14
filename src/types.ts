// src/types.ts

// The tools available in the toolbar.
export type Tool = 'bucket' | 'brush' | 'eraser';

// A line-art picture the child can color. The PNG provides both the visible
// outline and (via its black lines) the boundaries for the bucket flood-fill,
// so adding a character is just dropping in an image + one entry here.
export interface Artwork {
  id: string;
  name: string;
  image: string; // URL of a black-line-on-white PNG
}

// A theme groups several artworks together.
export interface Theme {
  id: string;
  name: string;
  artworks: Artwork[];
}

// Imperative actions a screen can trigger on the coloring canvas.
export interface CanvasHandle {
  undo: () => void;
  clear: () => void;
}
