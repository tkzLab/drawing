import { Paint } from '../types';

// Glitter rendering: any palette color can be painted as "キラキラ" — the base
// color sprinkled with lighter/darker speckles and small four-point stars.
// A tile is generated once per color (seeded by the color so it is stable
// across sessions) and used as a repeating CanvasPattern for both the bucket
// fill and the pen stroke.

const TILE = 96;

const tileCache = new Map<string, HTMLCanvasElement>();

const hexToRgb = (hex: string) => {
  const v = hex.replace('#', '');
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
};

// Small deterministic PRNG (mulberry32) so a color always gets the same tile.
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  // Four-point sparkle: a thin vertical + horizontal diamond.
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
};

const glitterTile = (color: string): HTMLCanvasElement => {
  const cached = tileCache.get(color);
  if (cached) return cached;

  const tile = document.createElement('canvas');
  tile.width = TILE;
  tile.height = TILE;
  const ctx = tile.getContext('2d')!;
  const { r, g, b } = hexToRgb(color);
  const rand = mulberry32(r * 65536 + g * 256 + b);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, TILE, TILE);

  // Darker flecks give depth; light flecks and stars give the sparkle. On very
  // dark bases the light dots carry the effect, on very light bases the dark ones.
  const dark = `rgb(${mix(r, 0, 0.35)}, ${mix(g, 0, 0.35)}, ${mix(b, 0, 0.35)})`;
  const light = `rgb(${mix(r, 255, 0.75)}, ${mix(g, 255, 0.75)}, ${mix(b, 255, 0.75)})`;
  const dot = (fill: string, n: number, rMin: number, rMax: number) => {
    ctx.fillStyle = fill;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.arc(rand() * TILE, rand() * TILE, rMin + rand() * (rMax - rMin), 0, Math.PI * 2);
      ctx.fill();
    }
  };
  dot(dark, 26, 0.8, 2.0);
  dot(light, 26, 0.8, 2.2);
  dot('rgba(255, 255, 255, 0.95)', 14, 0.7, 1.6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  for (let i = 0; i < 6; i++) {
    drawStar(ctx, rand() * TILE, rand() * TILE, 2.5 + rand() * 3.5);
  }

  tileCache.set(color, tile);
  return tile;
};

// The canvas fill/stroke style for a Paint: the plain color, or its glitter
// pattern. Patterns are anchored at the canvas origin, so separate strokes and
// fills of the same color line up seamlessly.
export const paintStyle = (
  ctx: CanvasRenderingContext2D,
  paint: Paint
): string | CanvasPattern => {
  if (!paint.glitter) return paint.color;
  return ctx.createPattern(glitterTile(paint.color), 'repeat') ?? paint.color;
};
