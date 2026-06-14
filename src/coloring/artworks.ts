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
    id: 'summer',
    name: 'なつ',
    artworks: [{ id: 'beach', name: 'うみべ', image: img('beach.png') }],
  },
];
