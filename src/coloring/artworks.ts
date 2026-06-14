import { Theme } from '../types';

// Black-line-on-white PNGs live in public/coloring/. The bucket tool flood-fills
// each area enclosed by the black lines, so the colorable "parts" come from the
// drawing itself — adding a picture is just a new entry below.
//
// NOTE: the sample image is from nurieyasan.com and is for development only.
// Replace with commercial-use / original / AI-generated art before publishing.
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
  {
    id: 'summer',
    name: 'なつ',
    artworks: [{ id: 'beach', name: 'うみべ', image: img('beach.png') }],
  },
];
