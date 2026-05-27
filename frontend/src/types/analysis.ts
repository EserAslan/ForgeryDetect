export type ClassicAlgorithm = 'sift' | 'surf' | 'akaze' | 'orb';
export type AIModel = 'vit' | 'swin';
export type AlgorithmKey = ClassicAlgorithm | AIModel;

export interface UploadedImage {
  id: number;
  image: string;
  original_name: string;
  uploaded_at: string;
}

export interface AnalysisResult {
  id: number;
  image: number;
  kind: 'classic' | 'ai';
  algorithm: AlgorithmKey;
  is_fake: boolean;
  confidence: number;
  metrics: Record<string, number | string>;
  output_image: string | null;
  processing_ms: number;
  created_at: string;
}
