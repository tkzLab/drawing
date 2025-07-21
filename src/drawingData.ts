// src/drawingData.ts
import { Theme } from './types';

// Import all drawing components
import Apple from './drawings/Apple';
import Car from './drawings/Car';
import Cat from './drawings/Cat';
import Dog from './drawings/Dog';

// Define the themes and the drawings within them
export const themes: Theme[] = [
  {
    id: 'animals',
    name: 'いきもの',
    drawings: [
      { id: 'cat', name: 'ねこ', component: Cat },
      { id: 'dog', name: 'いぬ', component: Dog },
    ],
  },
  {
    id: 'vehicles',
    name: 'のりもの',
    drawings: [
      { id: 'car', name: 'くるま', component: Car },
    ],
  },
  {
    id: 'foods',
    name: 'たべもの',
    drawings: [
      { id: 'apple', name: 'りんご', component: Apple },
    ],
  },
];
