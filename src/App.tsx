import { useState, useEffect, useCallback } from 'react';
import { Glasses, MapPin, Star, Camera, Wrench, Plane, ArrowDown } from 'lucide-react';
import type { Glasses as GlassesType, FaceAnalysisResult } from '@/types';
import { supabase } from '@/lib/supabase';
import { getRecommendations } from '@/lib/faceAnalysis';
import { FaceUpload } from '@/components/FaceUpload';
import { RecommendationSection } from '@/components/RecommendationSection';
import { BookingModal } from '@/components/BookingModal';

export default function App() {
  const [allGlasses, setAllGlasses] = useState<GlassesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<FaceAnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [bookingGlasses, setBookingGlasses] = useState<GlassesType | null>(null);
  const [scrollToResults, setScrollToResults] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('glasses')
          .select('*')
          .order('created_at');
        if (error) throw error;
        setAllGlasses(data || []);
      } catch {
        // Fallback empty — UI will show loading state
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAnalyzed = useCallback(
    (res: FaceAnalysisResult, url: string) => {
      const recommendations = getRecommendations(allGlasses, res.shape);
      setResult({ ...res, recommendations });
      setPreviewUrl(url);
      setScrollToResults(true);
    },
    [allGlasses],
  );

  useEffect(() => {
    if (scrollToResults && result) {
      const el = document.getElementById('results');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setScrollToResults(false);
    }
  }, [scrollToResults, result]);

  const handleReset = () => {
    setResult(null);
    setPreviewUrl('');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-white">
              <Glasses className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-slate-800">
                K-FIT<span className="text-sky-500">TING</span>
              </p>
              <p className="-mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">
                Korean Eyewear Experience
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 sm:flex">
            <a href="#how" className="text-xs font-medium text-slate-600 transition hover:text-sky-600">
              How it works
            </a>
            <a href="#upload" className="text-xs font-medium text-slate-600 transition hover:text-sky-600">
              Virtual Fitting
            </a>
            <a href="#tour" className="text-xs font-medium text-slate-600 transition hover:text-sky-600">
              Tour
            </a>
          </nav>
          <a
            href="#upload"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Try Now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-slate-50" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-100/40 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-slate-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 pt-12 pb-8 sm:pt-16 sm:pb-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-sky-600 shadow-sm">
                <Plane className="h-3 w-3" />
                Made for Korea-bound travelers
              </div>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Find your perfect{' '}
                <span className="bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
                  Korean glasses
                </span>{' '}
                — before you fly
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
                Upload a selfie, let our AI analyze your face shape, and get
                instant recommendations for K-style eyewear. Love what you see?
                Book an in-store fitting tour in Seoul.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#upload"
                  className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300/50 transition hover:bg-slate-800 active:scale-95"
                >
                  <Camera className="h-4 w-4" />
                  Start Virtual Fitting
                </a>
                <a
                  href="#tour"
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                >
                  <MapPin className="h-4 w-4" />
                  Explore Tours
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-600">4.9</span>
                  <span>rating</span>
                </div>
                <span className="text-slate-300">|</span>
                <span>2,400+ fittings completed</span>
                <span className="text-slate-300">|</span>
                <span>3 Seoul locations</span>
              </div>
            </div>

            {/* Hero image collage */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <img
                    src="https://images.pexels.com/photos/5331339/pexels-photo-5331339.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Person wearing glasses"
                    className="aspect-[3/4] w-full rounded-2xl object-cover shadow-lg"
                  />
                  <img
                    src="https://images.pexels.com/photos/29471622/pexels-photo-29471622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Eyewear store"
                    className="aspect-square w-full rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <div className="space-y-3 pt-8">
                  <img
                    src="https://images.pexels.com/photos/5201931/pexels-photo-5201931.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Trying on glasses"
                    className="aspect-square w-full rounded-2xl object-cover shadow-lg"
                  />
                  <img
                    src="https://images.pexels.com/photos/19271579/pexels-photo-19271579.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Seoul street"
                    className="aspect-[3/4] w-full rounded-2xl object-cover shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
            How it works
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Three simple steps to your perfect Korean eyewear
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: <Camera className="h-6 w-6" />,
              title: 'Upload a selfie',
              desc: 'Take or upload a front-facing photo. Our AI detects your face shape in seconds.',
              step: '01',
            },
            {
              icon: <Glasses className="h-6 w-6" />,
              title: 'Get matched',
              desc: "We'll recommend 3 K-style frames that complement your unique face shape.",
              step: '02',
            },
            {
              icon: <MapPin className="h-6 w-6" />,
              title: 'Book a tour',
              desc: 'Loved a pair? Reserve an in-store fitting at one of our Seoul boutiques.',
              step: '03',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
            >
              <span className="absolute right-4 top-3 text-2xl font-black text-slate-100">
                {item.step}
              </span>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600">
            <Camera className="h-3 w-3" />
            Virtual Fitting
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl">
            Let's find your frames
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Upload a clear, front-facing photo and our AI will do the rest
          </p>
        </div>
        <div className="mt-6">
          <FaceUpload onAnalyzed={handleAnalyzed} />
        </div>
      </section>

      {/* Results */}
      <section id="results" className="mx-auto max-w-5xl px-5 pb-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">
              <Glasses className="h-6 w-6 animate-pulse" />
            </div>
            <p className="mt-3 text-sm text-slate-400">Loading eyewear catalog…</p>
          </div>
        )}
        {!loading && result && (
          <RecommendationSection
            result={result}
            previewUrl={previewUrl}
            onBookTour={setBookingGlasses}
            onReset={handleReset}
          />
        )}
        {!loading && !result && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
              <ArrowDown className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Upload your photo above to see personalized recommendations
            </p>
          </div>
        )}
      </section>

      {/* Tour Section */}
      <section id="tour" className="border-t border-slate-100 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                <MapPin className="h-3 w-3" />
                Offline Fitting Tour
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl">
                Visit our Seoul boutiques
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Book a free in-store fitting tour at one of our three Seoul
                locations. Try on your recommended frames, get expert styling
                advice, and enjoy a uniquely Korean eyewear shopping experience.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    icon: <Glasses className="h-4 w-4" />,
                    title: 'Try before you buy',
                    desc: 'Test your recommended frames in person',
                  },
                  {
                    icon: <Wrench className="h-4 w-4" />,
                    title: 'Free adjustments',
                    desc: 'Professional fitting and lens consultation',
                  },
                  {
                    icon: <Star className="h-4 w-4" />,
                    title: 'K-style styling',
                    desc: 'Get personalized advice from our fashion experts',
                  },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {f.title}
                      </p>
                      <p className="text-xs text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#upload"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95"
              >
                Start with Virtual Fitting
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.pexels.com/photos/5201936/pexels-photo-5201936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Trying on glasses"
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-md"
              />
              <div className="space-y-3 pt-6">
                <img
                  src="https://images.pexels.com/photos/5201933/pexels-photo-5201933.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Eyewear display"
                  className="aspect-square w-full rounded-2xl object-cover shadow-md"
                />
                <img
                  src="https://images.pexels.com/photos/8851560/pexels-photo-8851560.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Seoul street"
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-white">
                <Glasses className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                K-FIT<span className="text-sky-500">TING</span>
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Korean eyewear virtual fitting &amp; tour booking for travelers
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Myeongdong</span>
              <span>·</span>
              <span>Hongdae</span>
              <span>·</span>
              <span>Gangnam</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        glasses={bookingGlasses}
        onClose={() => setBookingGlasses(null)}
      />
    </div>
  );
}
