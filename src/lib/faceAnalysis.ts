import { FaceMesh, type NormalizedLandmark } from '@mediapipe/face_mesh';
import type { FaceLandmark, FaceShape, Glasses } from '@/types';

const FACE_SHAPE_INFO: Record<FaceShape, { label: string; description: string }> = {
  oval: {
    label: 'Oval',
    description: 'Your face is balanced with softly rounded proportions. Most frame shapes complement you naturally.',
  },
  round: {
    label: 'Round',
    description: 'Your face has soft curves and balanced width. Angular frames add definition and visual length.',
  },
  square: {
    label: 'Square',
    description: 'Your cheekbones and jaw have strong, balanced width. Rounded or softly curved frames create contrast.',
  },
  oblong: {
    label: 'Oblong',
    description: 'Your face is longer than it is wide. Deeper frames help add visual balance across your features.',
  },
  heart: {
    label: 'Heart',
    description: 'Your upper face is wider than your chin. Light or softly upswept frames balance the jawline.',
  },
};

export function createFaceMesh(onResults: (landmarks: FaceLandmark[]) => void): FaceMesh {
  const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  faceMesh.onResults((results) => {
    const landmarks = results.multiFaceLandmarks[0];
    if (landmarks) {
      onResults(landmarks.map(toFaceLandmark));
    }
  });

  return faceMesh;
}

function toFaceLandmark(landmark: NormalizedLandmark): FaceLandmark {
  return { x: landmark.x, y: landmark.y, z: landmark.z };
}

function distance(a: FaceLandmark, b: FaceLandmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function averagePoint(a: FaceLandmark, b: FaceLandmark): FaceLandmark {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
  };
}

export function detectFaceShape(landmarks: FaceLandmark[]): FaceShape {
  const foreheadWidth = distance(landmarks[127], landmarks[356]);
  const cheekWidth = distance(landmarks[234], landmarks[454]);
  const jawWidth = distance(landmarks[150], landmarks[379]);
  const faceWidth = cheekWidth;
  const faceHeight = distance(landmarks[10], landmarks[152]);
  const heightRatio = faceHeight / Math.max(faceWidth, 0.001);

  if (heightRatio > 1.48) return 'oblong';
  if (heightRatio < 1.16) return 'round';
  if (jawWidth / Math.max(cheekWidth, 0.001) > 0.82 && foreheadWidth / Math.max(cheekWidth, 0.001) > 0.84) {
    return 'square';
  }
  if (foreheadWidth / Math.max(cheekWidth, 0.001) > 1.04 && jawWidth / Math.max(cheekWidth, 0.001) < 0.78) {
    return 'heart';
  }
  return 'oval';
}

export function getFaceShapeInfo(shape: FaceShape) {
  return FACE_SHAPE_INFO[shape];
}

export function getRecommendations(allGlasses: Glasses[], shape: FaceShape): Glasses[] {
  const matched = allGlasses.filter((glasses) => glasses.face_shapes.includes(shape));
  const others = allGlasses.filter((glasses) => !glasses.face_shapes.includes(shape));
  return [...matched, ...others].slice(0, 3);
}

export function getFaceReferencePoints(landmarks: FaceLandmark[]) {
  return {
    leftEye: landmarks[468] ?? averagePoint(landmarks[33], landmarks[133]),
    rightEye: landmarks[473] ?? averagePoint(landmarks[362], landmarks[263]),
    bridge: landmarks[168] ?? landmarks[6],
    chin: landmarks[152],
    leftJaw: landmarks[150],
    rightJaw: landmarks[379],
  };
}

export function formatKRW(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
}
