// src/types.ts

// This interface allows parent components to call functions on child components,
// like clearing the canvas.
export interface DrawingHandle {
  clearCanvas: () => void;
}

// Defines the structure for a single drawing
export interface Drawing {
  id: string;
  name: string;
  component: React.FC<any>; // The actual React component for the drawing
}

// Defines the structure for a theme, which contains multiple drawings
export interface Theme {
  id: string;
  name: string;
  drawings: Drawing[];
}
