import { useEffect, useRef } from 'react';
import { Tool } from '../types';

const MAX_DIM = 1000; // downscale source art for snappy flood-fill
const LINE_THRESHOLD = 100; // luminance below this is treated as a line (a wall)
const MAX_HISTORY = 20;
const STROKE_RATIO = 0.014; // pen width relative to the longest image side

interface Params {
  colorRef: React.RefObject<HTMLCanvasElement>; // bottom layer: the colors
  lineRef: React.RefObject<HTMLCanvasElement>; // top layer: the black outline
  image: string;
  color: string;
  tool: Tool;
  onChange?: () => void; // fired after a save so the selection grid can refresh its thumbnail
}

const hexToRgb = (hex: string) => {
  const v = hex.replace('#', '');
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
};

// Coloring on a raster line-art image. The bucket tool flood-fills the area
// enclosed by the black lines; the pen/eraser also stay within the line-bounded
// area under the touch point (strokes never spill across the black lines).
// Everything happens on one "color" canvas (outline kept crisp on a layer
// above), so undo and clear behave consistently.
export const useImageColoring = ({ colorRef, lineRef, image, color, tool, onChange }: Params) => {
  const maskRef = useRef<Uint8Array | null>(null); // 1 = line/barrier
  const dimRef = useRef({ w: 0, h: 0 });
  const historyRef = useRef<ImageData[]>([]);

  // Per-stroke state for pen/eraser confinement.
  const strokingRef = useRef(false);
  const prevRef = useRef({ x: 0, y: 0 });
  const regionMaskCanvasRef = useRef<HTMLCanvasElement | null>(null); // alpha = inside touched region
  const scratchRef = useRef<HTMLCanvasElement | null>(null); // per-segment scratch

  const toolRef = useRef(tool);
  const colorValRef = useRef(color);
  const onChangeRef = useRef(onChange);
  toolRef.current = tool;
  colorValRef.current = color;
  onChangeRef.current = onChange;

  // Persist the colored layer per artwork in the browser so reopening a picture
  // restores what the child already painted. Only the color canvas is saved
  // (the outline is redrawn from the source image), as a transparent PNG.
  const storageKey = `nurie-color:v1:${image}`;
  // A flattened "white bg + colors + outline" thumbnail so the selection grid can
  // show how far the child has colored each picture (see thumbKey usage in NurieScreen).
  const thumbKey = `nurie-thumb:v1:${image}`;
  const THUMB_MAX = 160;
  const persistThumb = () => {
    const colorCanvas = colorRef.current;
    const lineCanvas = lineRef.current;
    const { w, h } = dimRef.current;
    if (!colorCanvas || !lineCanvas || w === 0) return;
    const scale = Math.min(1, THUMB_MAX / Math.max(w, h));
    const tw = Math.max(1, Math.round(w * scale));
    const th = Math.max(1, Math.round(h * scale));
    const off = document.createElement('canvas');
    off.width = tw;
    off.height = th;
    const octx = off.getContext('2d');
    if (!octx) return;
    octx.fillStyle = '#fff';
    octx.fillRect(0, 0, tw, th);
    octx.drawImage(colorCanvas, 0, 0, tw, th);
    octx.drawImage(lineCanvas, 0, 0, tw, th);
    try {
      localStorage.setItem(thumbKey, off.toDataURL('image/png'));
    } catch {
      /* storage full or unavailable — thumbnail just falls back to the blank line art */
    }
  };
  const persist = () => {
    const canvas = colorRef.current;
    if (!canvas || dimRef.current.w === 0) return;
    try {
      localStorage.setItem(storageKey, canvas.toDataURL('image/png'));
    } catch {
      /* storage full or unavailable — coloring just won't be remembered */
    }
    persistThumb();
    onChangeRef.current?.();
  };

  useEffect(() => {
    const colorCanvas = colorRef.current;
    const lineCanvas = lineRef.current;
    if (!colorCanvas || !lineCanvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      dimRef.current = { w, h };

      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const octx = off.getContext('2d');
      if (!octx) return;
      octx.drawImage(img, 0, 0, w, h);
      const src = octx.getImageData(0, 0, w, h).data;

      const mask = new Uint8Array(w * h);
      const lineImg = new ImageData(w, h);
      for (let i = 0; i < w * h; i++) {
        const r = src[i * 4];
        const g = src[i * 4 + 1];
        const b = src[i * 4 + 2];
        const a = src[i * 4 + 3];
        const lum = a === 0 ? 255 : 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < LINE_THRESHOLD) mask[i] = 1;
        // Outline layer: black, made transparent where the page is white so the
        // colors below show through (anti-aliased edges become soft via alpha).
        lineImg.data[i * 4 + 3] = a === 0 ? 0 : Math.max(0, Math.round(255 - lum));
      }
      maskRef.current = mask;

      colorCanvas.width = w;
      colorCanvas.height = h;
      colorCanvas.getContext('2d')?.clearRect(0, 0, w, h);

      // Restore previously saved coloring for this picture, if any.
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(storageKey);
      } catch {
        saved = null;
      }
      if (saved) {
        const restored = new Image();
        restored.onload = () => colorCanvas.getContext('2d')?.drawImage(restored, 0, 0, w, h);
        restored.src = saved;
      }

      lineCanvas.width = w;
      lineCanvas.height = h;
      lineCanvas.getContext('2d')?.putImageData(lineImg, 0, 0);

      // Reusable offscreen canvases sized to the image.
      const region = (regionMaskCanvasRef.current ??= document.createElement('canvas'));
      region.width = w;
      region.height = h;
      const scratch = (scratchRef.current ??= document.createElement('canvas'));
      scratch.width = w;
      scratch.height = h;

      historyRef.current = [];
    };
    img.src = image;
  }, [image, colorRef, lineRef]);

  const snapshot = () => {
    const canvas = colorRef.current;
    const ctx = canvas?.getContext('2d');
    const { w, h } = dimRef.current;
    if (!canvas || !ctx || w === 0) return;
    historyRef.current.push(ctx.getImageData(0, 0, w, h));
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
  };

  const toPixel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = colorRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width),
      y: Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height),
    };
  };

  // Breadth-first fill over non-line pixels starting at (sx, sy).
  // Returns the set of pixels in that region, or null if the point is on a line.
  const computeRegion = (sx: number, sy: number) => {
    const mask = maskRef.current;
    const { w, h } = dimRef.current;
    if (!mask || w === 0) return null;
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return null;
    const start = sy * w + sx;
    if (mask[start]) return null;

    const visited = new Uint8Array(w * h);
    const stack = new Int32Array(w * h);
    let sp = 0;
    stack[sp++] = start;
    visited[start] = 1;
    while (sp > 0) {
      const i = stack[--sp];
      const x = i % w;
      const y = (i - x) / w;
      if (x > 0 && !visited[i - 1] && !mask[i - 1]) (visited[i - 1] = 1), (stack[sp++] = i - 1);
      if (x < w - 1 && !visited[i + 1] && !mask[i + 1]) (visited[i + 1] = 1), (stack[sp++] = i + 1);
      if (y > 0 && !visited[i - w] && !mask[i - w]) (visited[i - w] = 1), (stack[sp++] = i - w);
      if (y < h - 1 && !visited[i + w] && !mask[i + w]) (visited[i + w] = 1), (stack[sp++] = i + w);
    }
    return visited;
  };

  const floodFill = (sx: number, sy: number) => {
    const canvas = colorRef.current;
    const ctx = canvas?.getContext('2d');
    const { w, h } = dimRef.current;
    const region = computeRegion(sx, sy);
    if (!canvas || !ctx || !region) return;

    snapshot();
    const image = ctx.getImageData(0, 0, w, h);
    const out = image.data;
    const { r, g, b } = hexToRgb(colorValRef.current);
    for (let i = 0; i < w * h; i++) {
      if (!region[i]) continue;
      out[i * 4] = r;
      out[i * 4 + 1] = g;
      out[i * 4 + 2] = b;
      out[i * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    persist();
  };

  const strokeWidth = () => {
    const { w, h } = dimRef.current;
    return Math.max(2, Math.max(w, h) * STROKE_RATIO);
  };

  // Draw one stroke segment, masked to the region picked at pointer-down, onto
  // the color canvas (pen adds color, eraser removes it).
  const drawSegment = (x0: number, y0: number, x1: number, y1: number) => {
    const colorCanvas = colorRef.current;
    const scratch = scratchRef.current;
    const regionCanvas = regionMaskCanvasRef.current;
    const cctx = colorCanvas?.getContext('2d');
    const sctx = scratch?.getContext('2d');
    const { w, h } = dimRef.current;
    if (!cctx || !sctx || !scratch || !regionCanvas || w === 0) return;

    sctx.clearRect(0, 0, w, h);
    sctx.globalCompositeOperation = 'source-over';
    sctx.lineCap = 'round';
    sctx.lineJoin = 'round';
    sctx.lineWidth = strokeWidth();
    sctx.strokeStyle = colorValRef.current;
    sctx.beginPath();
    sctx.moveTo(x0, y0);
    sctx.lineTo(x1, y1);
    sctx.stroke();

    // Keep only the part of the segment that lies inside the touched region.
    sctx.globalCompositeOperation = 'destination-in';
    sctx.drawImage(regionCanvas, 0, 0);
    sctx.globalCompositeOperation = 'source-over';

    cctx.globalCompositeOperation = toolRef.current === 'eraser' ? 'destination-out' : 'source-over';
    cctx.drawImage(scratch, 0, 0);
    cctx.globalCompositeOperation = 'source-over';
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!maskRef.current) return;
    const p = toPixel(e);
    if (!p) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);

    if (toolRef.current === 'bucket') {
      floodFill(p.x, p.y);
      return;
    }

    // Pen / eraser: lock to the region under the touch point.
    const region = computeRegion(p.x, p.y);
    const regionCanvas = regionMaskCanvasRef.current;
    const rctx = regionCanvas?.getContext('2d');
    const { w, h } = dimRef.current;
    if (!region || !regionCanvas || !rctx) return;

    const maskImg = rctx.createImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      if (region[i]) maskImg.data[i * 4 + 3] = 255;
    }
    rctx.putImageData(maskImg, 0, 0);

    snapshot();
    prevRef.current = p;
    strokingRef.current = true;
    drawSegment(p.x, p.y, p.x, p.y); // a tap leaves a dot
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!strokingRef.current) return;
    const p = toPixel(e);
    if (!p) return;
    const prev = prevRef.current;
    drawSegment(prev.x, prev.y, p.x, p.y);
    prevRef.current = p;
  };

  const onPointerUp = () => {
    if (strokingRef.current) {
      strokingRef.current = false;
      persist(); // remember the finished pen/eraser stroke
    }
  };

  const undo = () => {
    const canvas = colorRef.current;
    const ctx = canvas?.getContext('2d');
    const { w, h } = dimRef.current;
    if (!canvas || !ctx || w === 0) return;
    const prev = historyRef.current.pop();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    if (prev) ctx.putImageData(prev, 0, 0);
    persist();
  };

  const clear = () => {
    const canvas = colorRef.current;
    const ctx = canvas?.getContext('2d');
    const { w, h } = dimRef.current;
    if (!canvas || !ctx || w === 0) return;
    snapshot();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    persist();
  };

  return { onPointerDown, onPointerMove, onPointerUp, undo, clear };
};
