import { useRef, useState, useCallback, useEffect } from 'react';
import { Move, ZoomIn, ZoomOut, Sparkles, Eye, EyeOff } from 'lucide-react';
import type { Glasses } from '@/types';
import { GlassesOverlaySVG } from './GlassesOverlaySVG';

interface VirtualTryOnProps {
  photoUrl: string;
  glasses: Glasses;
}

interface Position {
  x: number;
  y: number;
}

export function VirtualTryOn({ photoUrl, glasses }: VirtualTryOnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ x: 50, y: 38 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showGlasses, setShowGlasses] = useState(true);
  const dragStart = useRef<{ x: number; y: number; posX: number; posY: number }>({
    x: 0,
    y: 0,
    posX: 50,
    posY: 42,
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  }, [position.x, position.y]);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100;
      const newX = Math.max(5, Math.min(95, dragStart.current.posX + dx));
      const newY = Math.max(10, Math.min(85, dragStart.current.posY + dy));
      setPosition({ x: newX, y: newY });
    };

    const onUp = () => setIsDragging(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging]);

  const frameWidth = 62 * scale;
  const frameHeight = frameWidth * 0.42;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600">
          <Sparkles className="h-3.5 w-3.5" />
          Virtual Try-On
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
            title="Smaller"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-[10px] font-medium text-slate-400">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
            title="Larger"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-slate-200" />
          <button
            onClick={() => setShowGlasses(!showGlasses)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
            title={showGlasses ? 'Hide glasses' : 'Show glasses'}
          >
            {showGlasses ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Photo with overlay */}
      <div
        ref={containerRef}
        className="relative aspect-[4/5] w-full cursor-move select-none overflow-hidden bg-slate-100"
      >
        <img
          src={photoUrl}
          alt="Your face with glasses"
          className="h-full w-full object-cover"
          draggable={false}
        />

        {showGlasses && (
          <div
            onPointerDown={onPointerDown}
            className="absolute touch-none"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: `${frameWidth}%`,
              height: `${frameHeight}%`,
              transform: 'translate(-50%, -50%)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <GlassesOverlaySVG
              frameType={glasses.frame_type}
              className="h-full w-full drop-shadow-lg"
            />
          </div>
        )}

        {/* Drag hint */}
        {showGlasses && !isDragging && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/60 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm">
            <span className="flex items-center gap-1">
              <Move className="h-3 w-3" />
              Drag glasses to position on your face
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
