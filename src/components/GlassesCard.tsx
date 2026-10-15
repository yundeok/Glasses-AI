import { CalendarHeart, ShoppingBag } from 'lucide-react';
import type { Glasses } from '@/types';
import { formatKRW } from '@/lib/faceAnalysis';
import { getUploadedGlasses } from '@/glasses';

interface GlassesCardProps {
  glasses: Glasses;
  rank: number;
  onBookTour: (glasses: Glasses) => void;
}

export function GlassesCard({ glasses, rank, onBookTour }: GlassesCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="flex h-36 items-center justify-center bg-slate-50 p-5">
        <img src={getUploadedGlasses(rank - 1)} alt={`${glasses.name} frame`} className="max-h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500">{glasses.brand}</p>
            <h3 className="mt-1 text-sm font-bold text-slate-800">{glasses.name}</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">#{rank}</span>
        </div>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{glasses.description}</p>
        <p className="mt-3 text-sm font-bold text-sky-600">{formatKRW(glasses.price)}</p>
        <div className="mt-4 flex gap-2">
          <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95">
            <ShoppingBag className="h-3.5 w-3.5" />
            Buy Now
          </button>
          <button type="button" onClick={() => onBookTour(glasses)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs font-bold text-sky-700 transition hover:bg-sky-100 active:scale-95">
            <CalendarHeart className="h-3.5 w-3.5" />
            Book Tour
          </button>
        </div>
      </div>
    </div>
  );
}
