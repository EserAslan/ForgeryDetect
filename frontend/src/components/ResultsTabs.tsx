import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Clock, Zap } from 'lucide-react';
import type { AnalysisResult, UploadedImage } from '../types/analysis';
import { absoluteUrl } from '../api/client';
import { ComparisonChart } from './ComparisonChart';

interface Props {
  uploaded: UploadedImage | null;
  results: Record<string, AnalysisResult>;
}

const ALL_TABS = ['original', 'sift', 'surf', 'akaze', 'orb', 'vit', 'swin', 'comparison'] as const;

type TabKey = typeof ALL_TABS[number];

const TAB_LABELS: Record<TabKey, string> = {
  original: 'Orijinal',
  sift: 'SIFT',
  surf: 'SURF',
  akaze: 'AKAZE',
  orb: 'ORB',
  vit: 'ViT',
  swin: 'Swin',
  comparison: 'Karşılaştırma',
};

export function ResultsTabs({ uploaded, results }: Props) {
  const [active, setActive] = useState<TabKey>('original');

  if (!uploaded) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
        Sol panelden bir görüntü yükleyerek başla
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap gap-1 mb-4 border-b border-slate-800 pb-1">
        {ALL_TABS.map((tab) => {
          const has = tab === 'original' || tab === 'comparison' || !!results[tab];
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              disabled={!has}
              className={`px-3 py-1.5 text-sm rounded-t-lg transition
                ${active === tab
                  ? 'bg-slate-800 text-white border-b-2 border-brand-500'
                  : has
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-700 cursor-not-allowed'}
              `}
            >
              {TAB_LABELS[tab]}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto">
        {active === 'original' && <OriginalView uploaded={uploaded} />}
        {active === 'comparison' && <ComparisonChart results={results} />}
        {active !== 'original' && active !== 'comparison' && (
          results[active] ? (
            <ResultView result={results[active]} uploaded={uploaded} />
          ) : (
            <div className="text-slate-500 text-sm p-6">Bu algoritma henüz çalıştırılmadı.</div>
          )
        )}
      </div>
    </div>
  );
}

function OriginalView({ uploaded }: { uploaded: UploadedImage }) {
  return (
    <div className="space-y-3">
      <img
        src={absoluteUrl(uploaded.image) ?? ''}
        alt="original"
        className="max-h-[60vh] mx-auto rounded-xl"
      />
      <div className="text-center text-xs text-slate-500">
        {uploaded.original_name}
      </div>
    </div>
  );
}

function ResultView({
  result,
  uploaded,
}: {
  result: AnalysisResult;
  uploaded: UploadedImage;
}) {
  const outImg = absoluteUrl(result.output_image) ?? absoluteUrl(uploaded.image) ?? '';
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge fake={result.is_fake} />
        <Stat icon={<Zap className="w-3 h-3" />} label="Güven" value={`%${(result.confidence * 100).toFixed(1)}`} />
        <Stat icon={<Clock className="w-3 h-3" />} label="Süre" value={`${result.processing_ms} ms`} />
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          {result.algorithm}
        </span>
      </div>

      <img src={outImg} alt={result.algorithm} className="max-h-[55vh] mx-auto rounded-xl" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(result.metrics).map(([k, v]) => (
          <div key={k} className="rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
            <div className="text-sm text-slate-200 mt-0.5">{String(v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ fake }: { fake: boolean }) {
  return fake ? (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
      <AlertTriangle className="w-3 h-3" />
      SAHTE
    </span>
  ) : (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
      <CheckCircle2 className="w-3 h-3" />
      ORİJİNAL
    </span>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      {icon}
      <span>{label}:</span>
      <span className="text-slate-200 font-medium">{value}</span>
    </div>
  );
}
