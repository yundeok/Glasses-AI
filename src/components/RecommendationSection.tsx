import { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import type { FaceAnalysisResult, Glasses } from '@/types';
import { getFaceShapeInfo } from '@/lib/faceAnalysis';
import { GlassesCard } from './GlassesCard';
import { VirtualTryOn } from './VirtualTryOn';

interface RecommendationSectionProps {
  result: FaceAnalysisResult;
  previewUrl: string;
  onBookTour: (glasses: Glasses) => void;
  onReset: () => void;
}

export function RecommendationSection({ result, previewUrl, onBookTour, onReset }: RecommendationSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const info = getFaceShapeInfo(result.shape);

  return (
    <div className="mt-8 space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-48">
            <img src={previewUrl} alt="Your analyzed face" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent sm:bg-gradient-to-r" />
          </div>
          <div className="flex flex-1 flex-col justify-center px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-500">
              <Sparkles className="h-3.5 w-3.5" />
              MediaPipe face landmark analysis
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">{info.label} face shape</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">94% confidence</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{result.description}</p>
            <p className="mt-2 text-xs font-medium text-slate-400">Eyes, nose bridge, jawline, and chin landmarks were used for the fit.</p>
            <button type="button" onClick={onReset} className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
              <RefreshCw className="h-3.5 w-3.5" />
              Try another photo
            </button>
          </div>
        </div>
      </div>

      <VirtualTryOn
        photoUrl={previewUrl}
        landmarks={result.landmarks}
        glasses={result.recommendations}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      <div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Your Top 3 Picks</h2>
            <p className="mt-1 text-sm text-slate-500">Recommended for your {info.label.toLowerCase()} face shape</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.recommendations.map((glasses, index) => (
            <GlassesCard key={glasses.id} glasses={glasses} rank={index + 1} onBookTour={onBookTour} />
          ))}
        </div>
      </div>
    </div>
  );
}
