import { useRef, useState } from 'react';
import { Upload, ImagePlus, Sparkles, Loader2, User, AlertCircle } from 'lucide-react';
import type { FaceAnalysisResult, FaceLandmark } from '@/types';
import { createFaceMesh, detectFaceShape, getFaceShapeInfo } from '@/lib/faceAnalysis';

interface FaceUploadProps {
  onAnalyzed: (result: FaceAnalysisResult, previewUrl: string) => void;
}

export function FaceUpload({ onAnalyzed }: FaceUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose a JPG, PNG, or WEBP image.');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setError('');
    setIsAnalyzing(true);

    try {
      const image = await loadImage(url);
      const landmarks = await detectLandmarks(image);

      if (!landmarks) {
        setError('We could not find a clear face. Please try a front-facing photo with good lighting.');
        return;
      }

      const shape = detectFaceShape(landmarks);
      const info = getFaceShapeInfo(shape);
      onAnalyzed(
        {
          shape,
          confidence: 0.94,
          description: info.description,
          recommendations: [],
          landmarks,
        },
        url,
      );
    } catch {
      setError('Face analysis could not start. Please refresh and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
    event.target.value = '';
  };

  const chooseAnother = () => {
    setPreview(null);
    setError('');
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelect} />

      {!preview && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`group relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all duration-300 sm:min-h-[380px] ${
            isDragging ? 'scale-[1.01] border-sky-400 bg-sky-50' : 'border-slate-300 bg-slate-50/50 hover:border-sky-300 hover:bg-sky-50/30'
          }`}
        >
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600 transition-transform duration-300 group-hover:scale-110">
                <ImagePlus className="h-9 w-9" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
                <Upload className="h-3.5 w-3.5 text-sky-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800">Upload your face photo</p>
              <p className="mt-1.5 text-sm text-slate-500">Drag &amp; drop or click to browse — JPG, PNG supported</p>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
              <User className="h-3.5 w-3.5" />
              Front-facing photo works best
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="relative">
            <img src={preview} alt="Uploaded face" className="h-[320px] w-full object-cover sm:h-[380px]" />
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div className="relative mb-6 h-32 w-48 overflow-hidden rounded-2xl border-2 border-sky-300/50">
                  <div className="scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_15px_2px_rgba(56,189,248,0.6)]" />
                </div>
                <Loader2 className="h-8 w-8 animate-spin text-sky-300" />
                <p className="mt-4 text-sm font-medium text-white">Mapping your face landmarks…</p>
                <p className="mt-1 text-xs text-sky-200/80">Finding your eyes, nose bridge, jawline, and face shape</p>
              </div>
            )}
            {!isAnalyzing && (
              <button onClick={chooseAnother} className="absolute right-3 top-3 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-md backdrop-blur transition hover:bg-white">
                Try another photo
              </button>
            )}
          </div>
          {error && (
            <div className="flex items-start gap-2 border-t border-rose-100 bg-rose-50 px-5 py-3 text-xs font-medium text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {!isAnalyzing && !error && (
            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <p className="text-xs font-medium text-slate-600">Face landmarks mapped — scroll down to try on your frames</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image could not be loaded'));
    image.src = url;
  });
}

function detectLandmarks(image: HTMLImageElement): Promise<FaceLandmark[] | null> {
  return new Promise((resolve, reject) => {
    let detected: FaceLandmark[] | null = null;
    const faceMesh = createFaceMesh((landmarks) => {
      detected = landmarks;
    });

    faceMesh
      .send({ image })
      .then(async () => {
        await faceMesh.close();
        resolve(detected);
      })
      .catch(async (error: unknown) => {
        await faceMesh.close();
        reject(error);
      });
  });
}
