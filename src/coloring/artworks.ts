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
      { id: 'princess', name: 'おひめさま', image: img('princess.png') },
      { id: 'princess-castle', name: 'おしろのおひめさま', image: img('princess-castle.png') },
      { id: 'prince', name: 'おうじさま', image: img('prince.png') },
    ],
  },
];
