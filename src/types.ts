export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface Glasses {
  id: string;
  name: string;
  brand: string;
  price: number;
  frame_type: string;
  face_shapes: string[];
  image_url: string;
  wearing_image_url: string;
  description: string;
}

export type FaceShape = 'oval' | 'round' | 'square' | 'oblong' | 'heart';

export interface FaceAnalysisResult {
  shape: FaceShape;
  confidence: number;
  description: string;
  recommendations: Glasses[];
  landmarks: FaceLandmark[];
}

export interface TourBooking {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  preferred_date: string;
  preferred_time: string;
  party_size: number;
  glasses_id?: string;
  notes?: string;
  status?: string;
}
