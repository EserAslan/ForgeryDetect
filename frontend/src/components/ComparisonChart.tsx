import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AnalysisResult } from '../types/analysis';

interface Props {
  results: Record<string, AnalysisResult>;
}

export function ComparisonChart({ results }: Props) {
  const entries = Object.values(results);

  if (entries.length === 0) {
    return (
      <div className="text-slate-500 text-sm p-6">
        Henüz analiz yok. Önce bir algoritma çalıştır.
      </div>
    );
  }

  const data = entries.map((r) => ({
    name: r.algorithm.toUpperCase(),
    confidence: Number((r.confidence * 100).toFixed(1)),
    processing_ms: r.processing_ms,
    verdict: r.is_fake ? 'SAHTE' : 'ORİJİNAL',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Güven Skorları (%)</h3>
        <div className="h-64 rounded-xl bg-slate-900/40 border border-slate-800 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="confidence" name="Güven %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">İşlem Süreleri (ms)</h3>
        <div className="h-56 rounded-xl bg-slate-900/40 border border-slate-800 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="processing_ms" name="Süre (ms)" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Karar Tablosu</h3>
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-3 py-2 text-left">Algoritma</th>
                <th className="px-3 py-2 text-left">Karar</th>
                <th className="px-3 py-2 text-right">Güven</th>
                <th className="px-3 py-2 text-right">Süre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((row) => (
                <tr key={row.name} className="bg-slate-950/40">
                  <td className="px-3 py-2 font-medium text-slate-200">{row.name}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold
                        ${row.verdict === 'SAHTE'
                          ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'}
                      `}
                    >
                      {row.verdict}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-slate-300">{row.confidence}%</td>
                  <td className="px-3 py-2 text-right text-slate-300">{row.processing_ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
