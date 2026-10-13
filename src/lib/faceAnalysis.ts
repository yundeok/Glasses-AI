import type { Glasses, FaceShape } from '@/types';

const FACE_SHAPE_INFO: Record<FaceShape, { label: string; description: string }> = {
  oval: {
    label: 'Oval',
    description:
      'Your face is balanced with a slightly narrower jaw than temples. Most frame shapes suit you — you have the most versatile face shape.',
  },
  round: {
    label: 'Round',
    description:
      'Your face has soft curves with similar width and length. Angular and geometric frames add definition and structure.',
  },
  square: {
    label: 'Square',
    description:
      'Your face has a strong jaw and broad forehead. Round and oval frames soften your features beautifully.',
  },
  oblong: {
    label: 'Oblong',
    description:
      'Your face is longer than it is wide. Oversized and deep frames add width and balance your proportions.',
  },
  heart: {
    label: 'Heart',
    description:
      'Your forehead is wider than your narrow chin. Light, bottom-light frames complement your delicate jawline.',
  },
};

// Deterministic pseudo-random based on image data
function hashImage(data: ArrayBuffer): number {
  const bytes = new Uint8Array(data);
  let hash = 0;
  // Sample bytes across the image for speed
  const step = Math.max(1, Math.floor(bytes.length / 1000));
  for (let i = 0; i < bytes.length; i += step) {
    hash = ((hash << 5) - hash + bytes[i]) | 0;
  }
  return Math.abs(hash);
}

export function analyzeFaceShape(imageData: ArrayBuffer): FaceShape {
  const shapes: FaceShape[] = ['oval', 'round', 'square', 'oblong', 'heart'];
  const hash = hashImage(imageData);
  return shapes[hash % shapes.length];
}

export function getFaceShapeInfo(shape: FaceShape) {
  return FACE_SHAPE_INFO[shape];
}

export function getRecommendations(allGlasses: Glasses[], shape: FaceShape): Glasses[] {
  const matched = allGlasses.filter((g) => g.face_shapes.includes(shape));
  // If we have at least 3 matches, return them (up to 3)
  if (matched.length >= 3) return matched.slice(0, 3);
  // Otherwise fill from the rest
  const others = allGlasses.filter((g) => !g.face_shapes.includes(shape));
  return [...matched, ...others].slice(0, 3);
}

export function formatKRW(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
}
