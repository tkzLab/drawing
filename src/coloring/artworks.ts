import { Theme } from '../types';

// Line-art lives in public/coloring/. The bucket tool flood-fills each area
// enclosed by the black lines (works the same for PNG or SVG line art), so the
// colorable "parts" come from the drawing itself — adding a picture is just a
// new entry below plus the image file.
const img = (file: string) => `${import.meta.env.BASE_URL}coloring/${file}`;

export const themes: Theme[] = [
  {
    id: 'princess',
    name: 'プリンセス',
    artworks: [
      { id: 'princess-cute', name: 'かわいいおひめさま', image: img('princess-cute.png') },
      { id: 'unicorn', name: 'ユニコーン', image: img('unicorn.png') },
      { id: 'prince', name: 'おうじさま', image: img('prince.png') },
    ],
  },
  {
    id: 'dinosaur',
    name: 'きょうりゅう',
    artworks: [
      { id: 'dinosaur', name: 'きょうりゅう', image: img('dinosaur.png') },
    ],
  },
  {
    id: 'vehicles',
    name: 'のりもの',
    artworks: [
      { id: 'police-car', name: 'パトカー', image: img('police-car.png') },
    ],
  },
  {
    id: 'space',
    name: 'うちゅう',
    artworks: [
      { id: 'astronaut', name: 'うちゅうひこうし', image: img('astronaut.png') },
    ],
  },
  {
    id: 'food',
    name: 'たべもの',
    artworks: [
      { id: 'cupcake', name: 'カップケーキ', image: img('cupcake.png') },
    ],
  },
];
