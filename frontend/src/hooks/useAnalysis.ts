import { useState } from 'react';
import { toast } from 'sonner';
import {
  uploadImage,
  analyzeClassic,
  analyzeAI,
} from '../api/client';
import type {
  AnalysisResult,
  ClassicAlgorithm,
  AIModel,
  UploadedImage,
} from '../types/analysis';

export interface AnalysisState {
  uploaded: UploadedImage | null;
  isUploading: boolean;
  isAnalyzing: boolean;
  results: Record<string, AnalysisResult>;
  progress: { current: number; total: number } | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    uploaded: null,
    isUploading: false,
    isAnalyzing: false,
    results: {},
    progress: null,
  });

  async function upload(file: File) {
    setState((s) => ({ ...s, isUploading: true, results: {} }));
    try {
      const uploaded = await uploadImage(file);
      setState((s) => ({ ...s, uploaded, isUploading: false }));
      toast.success('Görüntü yüklendi');
    } catch (e) {
      setState((s) => ({ ...s, isUploading: false }));
      toast.error('Yükleme başarısız');
      throw e;
    }
  }

  async function runAnalyses(
    classics: ClassicAlgorithm[],
    aiModels: AIModel[]
  ) {
    if (!state.uploaded) {
      toast.error('Önce bir görüntü yükle');
      return;
    }
    const imageId = state.uploaded.id;
    const tasks: Array<{ key: string; run: () => Promise<AnalysisResult> }> = [
      ...classics.map((a) => ({
        key: a,
        run: () => analyzeClassic(imageId, a),
      })),
      ...aiModels.map((m) => ({
        key: m,
        run: () => analyzeAI(imageId, m),
      })),
    ];

    if (tasks.length === 0) {
      toast.warning('En az bir algoritma seç');
      return;
    }

    setState((s) => ({
      ...s,
      isAnalyzing: true,
      progress: { current: 0, total: tasks.length },
    }));

    const newResults: Record<string, AnalysisResult> = {};
    for (let i = 0; i < tasks.length; i++) {
      const { key, run } = tasks[i];
      try {
        const result = await run();
        newResults[key] = result;
        setState((s) => ({
          ...s,
          results: { ...s.results, [key]: result },
          progress: { current: i + 1, total: tasks.length },
        }));
      } catch (e: any) {
        const msg = e?.response?.data?.detail ?? `${key} başarısız`;
        toast.error(`${key.toUpperCase()}: ${msg}`);
      }
    }

    setState((s) => ({ ...s, isAnalyzing: false, progress: null }));
    toast.success('Analiz tamamlandı');
  }

  function reset() {
    setState({
      uploaded: null,
      isUploading: false,
      isAnalyzing: false,
      results: {},
      progress: null,
    });
  }

  return { state, upload, runAnalyses, reset };
}
