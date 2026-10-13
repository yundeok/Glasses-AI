import { useState, useEffect } from 'react';
import { X, CalendarHeart, CheckCircle2, Loader2, Globe } from 'lucide-react';
import type { Glasses, TourBooking } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatKRW } from '@/lib/faceAnalysis';

interface BookingModalProps {
  glasses: Glasses | null;
  onClose: () => void;
}

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '2:30 PM',
  '4:00 PM',
  '5:30 PM',
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Japan',
  'China',
  'France',
  'Germany',
  'Australia',
  'Canada',
  'Singapore',
  'Thailand',
  'Vietnam',
  'Other',
];

const TOUR_LOCATIONS = [
  { name: 'Myeongdong Flagship', address: '28 Myeongdong-gil, Jung-gu, Seoul' },
  { name: 'Hongdae Studio', address: '35 Hongik-ro, Mapo-gu, Seoul' },
  { name: 'Gangnam Boutique', address: '12 Apgujeong-ro, Gangnam-gu, Seoul' },
];

export function BookingModal({ glasses, onClose }: BookingModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<TourBooking>({
    name: '',
    email: '',
    phone: '',
    country: '',
    preferred_date: '',
    preferred_time: '',
    party_size: 1,
    glasses_id: glasses?.id,
    notes: '',
  });
  const [location, setLocation] = useState(TOUR_LOCATIONS[0]);

  useEffect(() => {
    if (glasses) {
      setForm((f) => ({ ...f, glasses_id: glasses.id }));
      setSuccess(false);
    }
  }, [glasses]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  if (!glasses) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('tour_bookings').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        country: form.country,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        party_size: form.party_size,
        glasses_id: form.glasses_id || null,
        notes: form.notes || null,
        status: 'pending',
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <CalendarHeart className="h-5 w-5 text-sky-500" />
            <h2 className="text-base font-bold text-slate-800">
              Book Fitting Tour
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Booking Confirmed!
            </h3>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              We've received your fitting tour request for{' '}
              <span className="font-semibold text-slate-700">{glasses.name}</span>.
              A confirmation email will be sent to{' '}
              <span className="font-semibold text-slate-700">{form.email}</span>.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Location: {location.name} · {form.preferred_date} ·{' '}
              {form.preferred_time}
            </p>
          </div>
        ) : (
          <div className="px-5 pb-6">
            {/* Glasses summary */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
              <img
                src={glasses.image_url}
                alt={glasses.name}
                className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {glasses.name}
                </p>
                <p className="text-xs text-slate-500">{glasses.brand}</p>
                <p className="mt-0.5 text-xs font-semibold text-sky-600">
                  {formatKRW(glasses.price)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Location picker */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Tour Location
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {TOUR_LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                        location.name === loc.name
                          ? 'border-sky-300 bg-sky-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {loc.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {loc.address}
                        </p>
                      </div>
                      {location.name === loc.name && (
                        <CheckCircle2 className="h-4 w-4 text-sky-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    placeholder="jane@email.com"
                  />
                </div>
              </div>

              {/* Phone & Country */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Country *
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      required
                      value={form.country}
                      onChange={(e) =>
                        setForm({ ...form, country: e.target.value })
                      }
                      className="w-full appearance-none rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="">Select…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.preferred_date}
                    onChange={(e) =>
                      setForm({ ...form, preferred_date: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Party Size *
                  </label>
                  <select
                    required
                    value={form.party_size}
                    onChange={(e) =>
                      setForm({ ...form, party_size: parseInt(e.target.value) })
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time slots */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Preferred Time *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, preferred_time: slot })
                      }
                      className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                        form.preferred_time === slot
                          ? 'border-sky-300 bg-sky-50 text-sky-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  placeholder="Any special requests?"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !form.preferred_time}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition-all duration-200 hover:from-sky-600 hover:to-sky-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CalendarHeart className="h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-400">
                Free cancellation up to 24 hours before your tour
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
