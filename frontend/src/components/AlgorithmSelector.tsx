import { Cpu, Brain, Loader2, Play } from 'lucide-react';
import type { ClassicAlgorithm, AIModel } from '../types/analysis';

interface Props {
  classics: ClassicAlgorithm[];
  aiModels: AIModel[];
  onToggleClassic: (a: ClassicAlgorithm) => void;
  onToggleAI: (m: AIModel) => void;
  onRun: () => void;
  disabled: boolean;
  isAnalyzing: boolean;
  progress: { current: number; total: number } | null;
}

const CLASSIC_OPTIONS: ClassicAlgorithm[] = ['sift', 'surf', 'akaze', 'orb'];
const AI_OPTIONS: AIModel[] = ['vit', 'swin'];

export function AlgorithmSelector({
  classics,
  aiModels,
  onToggleClassic,
  onToggleAI,
  onRun,
  disabled,
  isAnalyzing,
  progress,
}: Props) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3 text-slate-200 font-medium">
          <Cpu className="w-4 h-4" />
          Klasik CV Algoritmaları
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CLASSIC_OPTIONS.map((opt) => {
            const checked = classics.includes(opt);
            return (
              <label
                key={opt}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition
                  ${checked
                    ? 'border-brand-500 bg-brand-500/10 text-brand-50'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'}
                `}
              >
                <input
                  type="checkbox"
                  className="accent-brand-500"
                  checked={checked}
                  onChange={() => onToggleClassic(opt)}
                />
                <span className="uppercase text-xs font-semibold">{opt}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3 text-slate-200 font-medium">
          <Brain className="w-4 h-4" />
          AI Modelleri
        </div>
        <div className="grid grid-cols-2 gap-2">
          {AI_OPTIONS.map((opt) => {
            const checked = aiModels.includes(opt);
            return (
              <label
                key={opt}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition
                  ${checked
                    ? 'border-purple-500 bg-purple-500/10 text-purple-50'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'}
                `}
              >
                <input
                  type="checkbox"
                  className="accent-purple-500"
                  checked={checked}
                  onChange={() => onToggleAI(opt)}
                />
                <span className="uppercase text-xs font-semibold">
                  {opt === 'vit' ? 'ViT' : 'Swin'}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <button
        onClick={onRun}
        disabled={disabled || isAnalyzing}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
          bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold
          hover:from-brand-700 hover:to-purple-700 transition
          disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {progress
              ? `Çalışıyor... ${progress.current}/${progress.total}`
              : 'Çalışıyor...'}
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Analizi Başlat
          </>
        )}
      </button>
    </div>
  );
}
