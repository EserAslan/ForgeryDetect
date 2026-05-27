import { useState } from 'react';
import { ScanSearch, Github } from 'lucide-react';
import { UploadPanel } from './components/UploadPanel';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { ResultsTabs } from './components/ResultsTabs';
import { useAnalysis } from './hooks/useAnalysis';
import type { ClassicAlgorithm, AIModel } from './types/analysis';

export default function App() {
  const { state, upload, runAnalyses, reset } = useAnalysis();
  const [classics, setClassics] = useState<ClassicAlgorithm[]>(['sift']);
  const [aiModels, setAiModels] = useState<AIModel[]>(['vit']);

  const toggleClassic = (a: ClassicAlgorithm) =>
    setClassics((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const toggleAI = (m: AIModel) =>
    setAiModels((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
              <ScanSearch className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">ForgeryDetect</div>
              <div className="text-[10px] text-slate-500">Görüntü Sahteciliği Tespiti</div>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white transition"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1 space-y-4">
          <UploadPanel
            uploaded={state.uploaded}
            isUploading={state.isUploading}
            onUpload={upload}
            onReset={reset}
          />
          <AlgorithmSelector
            classics={classics}
            aiModels={aiModels}
            onToggleClassic={toggleClassic}
            onToggleAI={toggleAI}
            onRun={() => runAnalyses(classics, aiModels)}
            disabled={!state.uploaded}
            isAnalyzing={state.isAnalyzing}
            progress={state.progress}
          />
        </aside>

        <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/30 p-5 min-h-[60vh]">
          <ResultsTabs uploaded={state.uploaded} results={state.results} />
        </section>
      </main>

      <footer className="text-center text-xs text-slate-600 py-6">
        Ar-Ge Projesi · 2026 · SIFT · SURF · AKAZE · ORB · ViT · Swin
      </footer>
    </div>
  );
}
