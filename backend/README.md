# Görüntü Sahteciliği Tespiti — Backend (Django REST Framework)

## Kurulum

```bash
python -m venv venv
venv\Scripts\activate           # Windows
# source venv/bin/activate      # Linux/macOS

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Server: http://localhost:8000

## Model Dosyaları

Colab'dan indirdiğin `vit.zip` ve `swin.zip` dosyalarını aç:

```
backend/
  models/
    vit/
      model.onnx
      model.onnx.data
      config.json
      preprocessor_config.json
    swin/
      model.onnx
      model.onnx.data
      config.json
      preprocessor_config.json
```

Model klasörleri yoksa AI endpoint'i 503 döner, klasik CV endpoint'leri çalışmaya devam eder.

## API Endpoints

| Method | URL | Body | Açıklama |
|--------|-----|------|----------|
| POST | `/api/images/` | multipart: `image` | Görüntü yükle |
| GET | `/api/images/<id>/` | — | Görüntü detayı |
| POST | `/api/analyze/classic/` | `{image_id, algorithm}` | algorithm: sift\|surf\|akaze\|orb |
| POST | `/api/analyze/ai/` | `{image_id, model}` | model: vit\|swin |
| GET | `/api/analyze/results/<image_id>/` | — | Tüm analiz sonuçları |

## Hızlı Test

```bash
# 1) Resim yükle
curl -F "image=@test.jpg" http://localhost:8000/api/images/

# 2) SIFT ile analiz
curl -X POST http://localhost:8000/api/analyze/classic/ \
  -H "Content-Type: application/json" \
  -d '{"image_id": 1, "algorithm": "sift"}'

# 3) ViT ile analiz
curl -X POST http://localhost:8000/api/analyze/ai/ \
  -H "Content-Type: application/json" \
  -d '{"image_id": 1, "model": "vit"}'
```

## Sprint Planı (commit sırası)

| Sprint | Eklenen |
|--------|---------|
| 0 | Django proje iskeleti, upload endpoint, model |
| 1 | SIFT entegrasyonu (`classic.py` → `_detector('sift')`) |
| 2 | SURF + AKAZE eklendi |
| 3 | ORB eklendi |
| 4 | ViT ONNX entegrasyonu (`ai.py`) |
| 5 | Swin ONNX entegrasyonu |
| 6 | SonarQube + Doxygen + testler |

> Her sprint için ayrı feature branch aç (`feature/sift`, `feature/vit-model` vb.).

## Test

```bash
python manage.py test
```
