# Forgery Detect — Frontend

React + Vite + TypeScript + Tailwind ile yazılmış kullanıcı arayüzü. Backend (Django REST Framework) ile konuşur.

## Kurulum

```bash
npm install
cp .env.example .env   # gerekirse API URL'i değiştir
npm run dev
```

Tarayıcı: http://localhost:5173

> Backend'in `http://localhost:8000` üzerinde çalışıyor olması gerekir.

## Yapı

```
src/
├── api/client.ts             # axios instance + endpoint fonksiyonları
├── components/
│   ├── UploadPanel.tsx       # Sürükle-bırak dosya yükleme
│   ├── AlgorithmSelector.tsx # SIFT/SURF/AKAZE/ORB + ViT/Swin seçimi
│   ├── ResultsTabs.tsx       # Sekmeli sonuç görünümü
│   └── ComparisonChart.tsx   # Recharts ile karşılaştırma
├── hooks/useAnalysis.ts      # Upload + analiz state mantığı
├── types/analysis.ts         # TypeScript tipleri
├── App.tsx                   # Ana layout
├── main.tsx                  # Provider'lar + render
└── index.css                 # Tailwind direktifleri
```

## Akış

1. **Yükle** — sol panele görüntü sürükle
2. **Seç** — istediğin algoritmaları işaretle
3. **Çalıştır** — "Analizi Başlat" butonu, sırayla backend'i çağırır
4. **İncele** — sağ panelde sekmeler arasında geç, "Karşılaştırma" sekmesinde tüm sonuçları yan yana gör

## Build

```bash
npm run build       # dist/ klasörüne static dosyalar
npm run preview     # build'i lokal serve et
```
