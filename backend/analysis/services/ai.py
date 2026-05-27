"""ViT / Swin ONNX inference servisi.

Modeller `BASE_DIR/models/vit/` ve `BASE_DIR/models/swin/` altında olmalı.
Preprocessor torch bağımlılığı olmadan PIL + numpy ile manuel uygulanıyor.
"""
import json
import time
from functools import lru_cache
from pathlib import Path
import numpy as np
import onnxruntime as ort
from PIL import Image
from django.conf import settings

LABELS = ['authentic', 'tampered']


def _build_preprocessor(config: dict):
    """preprocessor_config.json okuyup tek bir fonksiyon döner."""
    image_mean = np.array(config.get('image_mean', [0.485, 0.456, 0.406]), dtype=np.float32)
    image_std = np.array(config.get('image_std', [0.229, 0.224, 0.225]), dtype=np.float32)
    size = config.get('size', {})
    if isinstance(size, dict):
        height = size.get('height') or size.get('shortest_edge') or 224
        width = size.get('width') or size.get('shortest_edge') or 224
    else:
        height = width = int(size)
    rescale_factor = config.get('rescale_factor', 1.0 / 255.0)

    def preprocess(pil_image: Image.Image) -> np.ndarray:
        img = pil_image.convert('RGB').resize((width, height), Image.BILINEAR)
        arr = np.asarray(img, dtype=np.float32) * rescale_factor
        arr = (arr - image_mean) / image_std
        arr = arr.transpose(2, 0, 1)[None, ...]  # HWC -> NCHW
        return arr.astype(np.float32)

    return preprocess


@lru_cache(maxsize=4)
def _load(model_name: str):
    model_dir = Path(settings.ONNX_MODELS_DIR) / model_name
    onnx_path = model_dir / 'model.onnx'
    config_path = model_dir / 'preprocessor_config.json'
    if not onnx_path.exists():
        raise FileNotFoundError(f'{onnx_path} bulunamadı')
    if not config_path.exists():
        raise FileNotFoundError(f'{config_path} bulunamadı')

    with open(config_path, 'r', encoding='utf-8') as f:
        preprocessor_config = json.load(f)
    preprocess = _build_preprocessor(preprocessor_config)

    session = ort.InferenceSession(str(onnx_path), providers=['CPUExecutionProvider'])
    input_name = session.get_inputs()[0].name
    return preprocess, session, input_name


def classify(image_path: str, model_name: str) -> dict:
    if model_name not in ('vit', 'swin'):
        raise ValueError(f'Bilinmeyen model: {model_name}')

    t0 = time.perf_counter()
    preprocess, session, input_name = _load(model_name)

    pil = Image.open(image_path)
    pixel_values = preprocess(pil)
    logits = session.run(None, {input_name: pixel_values})[0]

    # Softmax (sayısal kararlı)
    exp = np.exp(logits - logits.max(axis=1, keepdims=True))
    probs = exp / exp.sum(axis=1, keepdims=True)
    pred = int(probs.argmax(axis=1)[0])

    return {
        'is_fake': pred == 1,
        'confidence': float(probs[0, pred]),
        'metrics': {
            'model': model_name,
            'authentic_prob': round(float(probs[0, 0]), 4),
            'tampered_prob': round(float(probs[0, 1]), 4),
        },
        'processing_ms': int((time.perf_counter() - t0) * 1000),
    }
