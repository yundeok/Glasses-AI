import glassesOne from './glasses-1.png.png';
import glassesTwo from './glasses-2.png.png';
import glassesThree from './glasses-3.png.png';

export const uploadedGlasses = [glassesOne, glassesTwo, glassesThree] as const;

export function getUploadedGlasses(index: number): string {
  return uploadedGlasses[index % uploadedGlasses.length];
}
