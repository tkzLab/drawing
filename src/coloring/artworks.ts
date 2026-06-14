import { Theme } from '../types';

// Line-art lives in public/coloring/ (hand-authored original SVGs). The bucket
// tool flood-fills each area enclosed by the black lines, so the colorable
// "parts" come from the drawing itself — adding a picture is just a new entry
// below plus the image file.
const img = (file: string) => `${import.meta.env.BASE_URL}coloring/${file}`;

export const themes: Theme[] = [
  {
    id: 'animals',
    name: 'どうぶつ',
    artworks: [
      { id: 'cat', name: 'ねこ', image: img('cat.svg') },
      { id: 'dog', name: 'いぬ', image: img('dog.svg') },
      { id: 'bear', name: 'くま', image: img('bear.svg') },
      { id: 'rabbit', name: 'うさぎ', image: img('rabbit.svg') },
      { id: 'panda', name: 'ぱんだ', image: img('panda.svg') },
      { id: 'frog', name: 'かえる', image: img('frog.svg') },
      { id: 'lion', name: 'らいおん', image: img('lion.svg') },
    ],
  },
];
