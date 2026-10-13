import { ShoppingBag, CalendarHeart, Eye } from 'lucide-react';
import type { Glasses } from '@/types';
import { formatKRW } from '@/lib/faceAnalysis';
import { VirtualTryOn } from './VirtualTryOn';

interface GlassesCardProps {
  glasses: Glasses;
  rank: number;
  photoUrl: string;
  onBookTour: (glasses: Glasses) => void;
}

export function GlassesCard({ glasses, rank, photoUrl, onBookTour }: GlassesCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Virtual try-on: user's photo with glasses overlay */}
      <div className="relative">
        <VirtualTryOn photoUrl={photoUrl} glasses={glasses} />
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-sky-600 shadow-sm backdrop-blur">
          #{rank} Pick
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {glasses.brand}
        </div>
      </div>

      {/* Product image thumbnail */}
      <div className="relative flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <img
          src={glasses.image_url}
          alt={glasses.name}
          className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-800">
            {glasses.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {glasses.frame_type}
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs font-semibold text-sky-600">
              {formatKRW(glasses.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 px-4 py-3">
        <p className="text-xs leading-relaxed text-slate-500">
          {glasses.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-slate-800 active:scale-95">
          <ShoppingBag className="h-3.5 w-3.5" />
          Buy Now
        </button>
        <button
          onClick={() => onBookTour(glasses)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs font-bold text-sky-700 transition-all duration-200 hover:bg-sky-100 active:scale-95"
        >
          <CalendarHeart className="h-3.5 w-3.5" />
          Book Fitting Tour
        </button>
      </div>

      {/* Preview hint */}
      <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50/30 py-2 text-[10px] font-medium text-slate-400">
        <Eye className="h-3 w-3" />
        Drag the glasses to adjust the fit on your photo
      </div>
    </div>
  );
}
