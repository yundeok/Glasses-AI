import { useEffect, useRef, useState } from 'react';
import { Glasses, RotateCw, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import type { FaceLandmark, Glasses as GlassesType } from '@/types';
import { getFaceReferencePoints } from '@/lib/faceAnalysis';
import { getUploadedGlasses } from '@/glasses';

interface VirtualTryOnProps {
  photoUrl: string;
  landmarks: FaceLandmark[];
  glasses: GlassesType[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function VirtualTryOn({ photoUrl, landmarks, glasses, selectedIndex, onSelect }: VirtualTryOnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [frame, setFrame] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const selectedGlasses = glasses[selectedIndex];

  useEffect(() => {
    const image = new Image();
    image.onload = () => setPhoto(image);
    image.src = photoUrl;
  }, [photoUrl]);

  useEffect(() => {
    if (!selectedGlasses) return;
    const image = new Image();
    image.onload = () => setFrame(image);
    image.src = getUploadedGlasses(selectedIndex);
  }, [selectedGlasses, selectedIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !photo || !frame || landmarks.length < 455) return;

    const draw = () => drawTryOn(canvas, photo, frame, landmarks, zoom);
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    draw();

    return () => resizeObserver.disconnect();
  }, [photo, frame, landmarks, zoom]);

  if (!selectedGlasses) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Sparkles className="h-4 w-4 text-sky-500" />
            Real-time virtual fitting
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">Landmark-aligned to your eyes and nose bridge</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((value) => Math.max(0.85, value - 0.05))} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700" aria-label="Make glasses smaller">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-9 text-center text-[10px] font-semibold text-slate-400">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((value) => Math.min(1.2, value + 0.05))} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700" aria-label="Make glasses larger">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button onClick={() => setZoom(1)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700" aria-label="Reset glasses size">
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative bg-slate-100">
        <canvas ref={canvasRef} className="block aspect-[4/5] h-auto w-full" aria-label={`Virtual try-on preview of ${selectedGlasses.name}`} />
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/65 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm">
          Auto-fitted to your face landmarks
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">Choose your frame</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Switch instantly without uploading again</p>
          </div>
          <Glasses className="h-5 w-5 text-sky-500" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {glasses.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(index)}
              className={`overflow-hidden rounded-xl border-2 text-left transition ${selectedIndex === index ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div className="flex h-16 items-center justify-center bg-slate-50 p-2">
                <img src={getUploadedGlasses(index)} alt={`${item.name} frame`} className="max-h-full w-full object-contain" />
              </div>
              <div className="px-2 py-2">
                <p className="truncate text-[11px] font-bold text-slate-700">{index + 1}. {item.name}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">Tap to try on</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function drawTryOn(
  canvas: HTMLCanvasElement,
  photo: HTMLImageElement,
  frame: HTMLImageElement,
  landmarks: FaceLandmark[],
  zoom: number,
) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * window.devicePixelRatio));
  const height = Math.max(1, Math.round(rect.height * window.devicePixelRatio));
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, width, height);

  const imageScale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
  const imageWidth = photo.naturalWidth * imageScale;
  const imageHeight = photo.naturalHeight * imageScale;
  const offsetX = (width - imageWidth) / 2;
  const offsetY = (height - imageHeight) / 2;
  context.drawImage(photo, offsetX, offsetY, imageWidth, imageHeight);

  const point = (landmark: FaceLandmark) => ({
    x: offsetX + landmark.x * imageWidth,
    y: offsetY + landmark.y * imageHeight,
  });
  const references = getFaceReferencePoints(landmarks);
  const leftEye = point(references.leftEye);
  const rightEye = point(references.rightEye);
  const bridge = point(references.bridge);
  const eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
  const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const targetWidth = eyeDistance * 2.45 * zoom;
  const targetHeight = targetWidth * (frame.naturalHeight / frame.naturalWidth);

  context.save();
  context.translate(bridge.x, bridge.y);
  context.rotate(angle);
  context.shadowColor = 'rgba(15, 23, 42, 0.38)';
  context.shadowBlur = Math.max(3, targetWidth * 0.018);
  context.shadowOffsetY = Math.max(1, targetWidth * 0.012);
  context.drawImage(frame, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
  context.restore();
}
