"""Klasik CV algoritmaları ile copy-move sahtecilik tespiti.

Sprint planında her algoritma TEKİL olarak eklenecek:
  Sprint 1: SIFT
  Sprint 2: SURF + AKAZE
  Sprint 3: ORB
"""
import time
import cv2
import numpy as np


def _imread_unicode(path: str):
    """cv2.imread, Windows'ta non-ASCII yolları okuyamaz — numpy ile dolaşma yolu."""
    data = np.fromfile(path, dtype=np.uint8)
    if data.size == 0:
        return None
    return cv2.imdecode(data, cv2.IMREAD_COLOR)


def _detector(name: str):
    if name == 'sift':
        return cv2.SIFT_create()
    if name == 'surf':
        # opencv-contrib-python (pip) SURF'ü patent nedeniyle kapatıyor.
        # KAZE, SURF'ün modern patentsiz alternatifidir — aynı görevi yapar.
        if hasattr(cv2, 'xfeatures2d') and hasattr(cv2.xfeatures2d, 'SURF_create'):
            try:
                return cv2.xfeatures2d.SURF_create(400)
            except cv2.error:
                pass
        return cv2.KAZE_create()
    if name == 'akaze':
        return cv2.AKAZE_create()
    if name == 'orb':
        return cv2.ORB_create(nfeatures=2000)
    raise ValueError(f'Bilinmeyen algoritma: {name}')


def detect_copy_move(image_path: str, algorithm: str):
    t0 = time.perf_counter()

    img = _imread_unicode(image_path)
    if img is None:
        raise ValueError('Görüntü okunamadı')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    detector = _detector(algorithm)
    keypoints, descriptors = detector.detectAndCompute(gray, None)

    if descriptors is None or len(keypoints) < 10:
        return {
            'is_fake': False, 'confidence': 0.0,
            'metrics': {'keypoints': len(keypoints), 'matches': 0},
            'output_image_bgr': img,
            'processing_ms': int((time.perf_counter() - t0) * 1000),
        }

    if algorithm == 'orb':
        matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
    else:
        matcher = cv2.BFMatcher(cv2.NORM_L2)

    # Copy-move tespiti: kendisiyle eşleştir, k=3 ile bak (ilk=kendisi, 2-3 candidate).
    raw_matches = matcher.knnMatch(descriptors, descriptors, k=3)

    good = []
    for triple in raw_matches:
        if len(triple) < 3:
            continue
        # İlk eşleşme her zaman noktanın kendisidir (distance=0); onu at.
        first_candidate = triple[1]
        second_candidate = triple[2]
        # Lowe ratio: kopya varsa first_candidate çok yakın, diğeri uzak olur
        if first_candidate.distance >= 0.75 * second_candidate.distance:
            continue
        if first_candidate.queryIdx == first_candidate.trainIdx:
            continue
        p1 = np.array(keypoints[first_candidate.queryIdx].pt)
        p2 = np.array(keypoints[first_candidate.trainIdx].pt)
        # Aynı noktanın çok yakınına eşleştirme (gürültü) — minimum ayrı mesafe
        if np.linalg.norm(p1 - p2) < 15:
            continue
        good.append(first_candidate)

    # Simetrik eşleşmeler (A->B ve B->A) çift sayılır
    matches_count = len(good) // 2
    is_fake = matches_count >= 5
    # Yumuşak doygunluk: 1 - exp(-matches/15) — hiç tam %100'e ulaşmaz
    # 5→%28, 10→%49, 20→%74, 30→%86, 50→%96
    confidence = float(1.0 - np.exp(-matches_count / 15.0))

    output = img.copy()
    for m in good[:200]:
        p1 = tuple(int(v) for v in keypoints[m.queryIdx].pt)
        p2 = tuple(int(v) for v in keypoints[m.trainIdx].pt)
        cv2.line(output, p1, p2, (0, 0, 255), 1)
        cv2.circle(output, p1, 3, (0, 255, 0), -1)
        cv2.circle(output, p2, 3, (0, 255, 0), -1)

    return {
        'is_fake': bool(is_fake),
        'confidence': float(confidence),
        'metrics': {
            'algorithm': algorithm,
            'keypoints': len(keypoints),
            'matches': int(matches_count),
        },
        'output_image_bgr': output,
        'processing_ms': int((time.perf_counter() - t0) * 1000),
    }
