import axios from 'axios';
import type {
  AnalysisResult,
  ClassicAlgorithm,
  AIModel,
  UploadedImage,
} from '../types/analysis';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
});

export async function uploadImage(file: File): Promise<UploadedImage> {
  const fd = new FormData();
  fd.append('image', file);
  const { data } = await api.post<UploadedImage>('/api/images/', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function analyzeClassic(
  imageId: number,
  algorithm: ClassicAlgorithm
): Promise<AnalysisResult> {
  const { data } = await api.post<AnalysisResult>('/api/analyze/classic/', {
    image_id: imageId,
    algorithm,
  });
  return data;
}

export async function analyzeAI(
  imageId: number,
  model: AIModel
): Promise<AnalysisResult> {
  const { data } = await api.post<AnalysisResult>('/api/analyze/ai/', {
    image_id: imageId,
    model,
  });
  return data;
}

export function absoluteUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
}
