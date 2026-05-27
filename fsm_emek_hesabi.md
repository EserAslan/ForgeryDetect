# Görüntü Sahteciliği Tespiti Projesi
## FSM (Functional Size Measurement) Yöntemi ile Emek Hesabı

**Yöntem:** Use Case Point (UCP)
**Takım:** 2 kişi
**Ders:** Yazılım Mühendisliği — 3. Sınıf
**Tarih:** Mayıs 2026

---

## 1. Giriş

Bu döküman, "İkinci Alternatif: Görüntünün Değiştirilip Değiştirilmediğinin Tespiti" başlıklı Ar-Ge projesinin geliştirme emeğini Use Case Point (UCP) yöntemi ile adam/saat cinsinden hesaplamaktadır. UCP yöntemi, Karner tarafından 1993'te önerilen ve özellikle nesne yönelimli projelerde yaygın kullanılan bir FSM tekniğidir.

UCP hesabı dört temel adımda yapılır:

1. **UAW** (Unadjusted Actor Weight) — aktörlerin karmaşıklığına göre puanlanması
2. **UUCW** (Unadjusted Use Case Weight) — kullanım senaryolarının karmaşıklığına göre puanlanması
3. **TCF** (Technical Complexity Factor) — teknik karmaşıklık faktörü
4. **ECF** (Environmental Complexity Factor) — çevresel karmaşıklık faktörü

Sonuçta:
**UCP = (UAW + UUCW) × TCF × ECF**

---

## 2. Aktörlerin Belirlenmesi (UAW)

Sistemde üç aktör bulunmaktadır.

**Tablo 1 — Aktör Ağırlıkları**

| Aktör | Tip | Açıklama | Ağırlık |
|-------|-----|----------|---------|
| Kullanıcı | Karmaşık (Complex) | Grafik arayüz üzerinden etkileşim kurar | 3 |
| ONNX Runtime | Orta (Average) | HTTP/protokol arayüzü ile inference servisi | 2 |
| Dosya Sistemi | Basit (Simple) | Sadece dosya okuma/yazma API'si | 1 |

**UAW = 3 + 2 + 1 = 6**

---

## 3. Kullanım Senaryoları (UUCW)

Sistem altı temel kullanım senaryosundan oluşmaktadır.

**Tablo 2 — Use Case Karmaşıklık Ağırlıkları**

| Kategori | Transaction Sayısı | Ağırlık |
|----------|--------------------|---------|
| Basit (Simple) | 1-3 | 5 |
| Orta (Average) | 4-7 | 10 |
| Karmaşık (Complex) | 8+ | 15 |

**Tablo 3 — Use Case Listesi**

| ID | Use Case | Transaction Sayısı | Tip | Ağırlık |
|----|----------|--------------------|----|---------|
| UC1 | Görüntü Yükle | 3 | Basit | 5 |
| UC2 | Algoritma Seçimi | 2 | Basit | 5 |
| UC3 | Klasik CV ile Analiz Et (SIFT/SURF/AKAZE/ORB) | 5 | Orta | 10 |
| UC4 | AI Modeli ile Analiz Et (ViT/Swin) | 4 | Orta | 10 |
| UC5 | Sonuçları Görüntüle | 4 | Orta | 10 |
| UC6 | Algoritmaları Karşılaştır | 5 | Orta | 10 |

**UUCW = 5 + 5 + 10 + 10 + 10 + 10 = 50**

**UUCP = UAW + UUCW = 6 + 50 = 56**

---

## 4. Teknik Karmaşıklık Faktörü (TCF)

Her teknik faktör 0-5 arasında değerlendirilir (0 = etkisiz, 5 = çok güçlü etki).

**Tablo 4 — Teknik Faktörler**

| Kod | Faktör | Ağırlık | Değer (0-5) | Toplam |
|-----|--------|---------|-------------|--------|
| T1 | Dağıtık sistem | 2.0 | 2 | 4.0 |
| T2 | Performans gereksinimi | 1.0 | 3 | 3.0 |
| T3 | Son kullanıcı verimliliği | 1.0 | 4 | 4.0 |
| T4 | Karmaşık iç işleme (AI inference) | 1.0 | 4 | 4.0 |
| T5 | Yeniden kullanılabilir kod | 1.0 | 3 | 3.0 |
| T6 | Kolay kurulum | 0.5 | 3 | 1.5 |
| T7 | Kolay kullanım | 0.5 | 4 | 2.0 |
| T8 | Taşınabilirlik | 2.0 | 3 | 6.0 |
| T9 | Değiştirilebilirlik | 1.0 | 3 | 3.0 |
| T10 | Eş zamanlılık | 1.0 | 1 | 1.0 |
| T11 | Güvenlik özellikleri | 1.0 | 1 | 1.0 |
| T12 | 3. parti erişim | 1.0 | 1 | 1.0 |
| T13 | Özel kullanıcı eğitimi | 1.0 | 1 | 1.0 |

**TFactor = 4.0 + 3.0 + 4.0 + 4.0 + 3.0 + 1.5 + 2.0 + 6.0 + 3.0 + 1.0 + 1.0 + 1.0 + 1.0 = 34.5**

**TCF = 0.6 + (0.01 × TFactor) = 0.6 + (0.01 × 34.5) = 0.945**

---

## 5. Çevresel Karmaşıklık Faktörü (ECF)

Geliştirici ekibin deneyim ve motivasyon faktörlerini temsil eder.

**Tablo 5 — Çevresel Faktörler**

| Kod | Faktör | Ağırlık | Değer (0-5) | Toplam |
|-----|--------|---------|-------------|--------|
| E1 | Geliştirme sürecine aşinalık | 1.5 | 3 | 4.5 |
| E2 | Uygulama alanı deneyimi | 0.5 | 2 | 1.0 |
| E3 | Nesne yönelimli programlama deneyimi | 1.0 | 3 | 3.0 |
| E4 | Lider analist yetkinliği | 0.5 | 3 | 1.5 |
| E5 | Motivasyon | 1.0 | 4 | 4.0 |
| E6 | Gereksinim kararlılığı | 2.0 | 4 | 8.0 |
| E7 | Yarı zamanlı personel | -1.0 | 0 | 0.0 |
| E8 | Zor programlama dili | -1.0 | 2 | -2.0 |

**EFactor = 4.5 + 1.0 + 3.0 + 1.5 + 4.0 + 8.0 + 0.0 + (-2.0) = 20.0**

**ECF = 1.4 + (-0.03 × EFactor) = 1.4 + (-0.03 × 20.0) = 0.80**

---

## 6. UCP Hesabı

**UCP = UUCP × TCF × ECF**

**UCP = 56 × 0.945 × 0.80**

**UCP = 42.34**

---

## 7. Adam/Saat Hesabı

Karner'in önerisi UCP başına 20 saattir. 3. sınıf öğrenci takımı için (Python, Django, OpenCV, PyTorch öğrenme süresi dahil) bu değer kullanılmıştır.

**Toplam Emek = UCP × 20 = 42.34 × 20 ≈ 847 adam/saat**

### 2 Kişilik Takım için Dağılım

| Metrik | Değer |
|--------|-------|
| Toplam emek | 847 adam/saat |
| Kişi başı emek | ~424 adam/saat |
| Günlük çalışma | 4 saat (ders dönemi içinde) |
| Kişi başı süre | ~106 iş günü |
| Takvim süresi | ~14-15 hafta (yaklaşık bir akademik dönem) |

### Sprint Bazlı Dağılım

| Sprint | İçerik | Tahmini Saat |
|--------|--------|--------------|
| Sprint 0 | Proje kurulumu, Django + React iskeletleri | 80 saat |
| Sprint 1 | SIFT entegrasyonu, görüntü yükleme | 120 saat |
| Sprint 2 | SURF + AKAZE entegrasyonu | 90 saat |
| Sprint 3 | ORB entegrasyonu, karşılaştırma görünümü | 80 saat |
| Sprint 4 | ViT modeli eğitimi (Colab) + ONNX entegrasyonu | 200 saat |
| Sprint 5 | Swin Transformer modeli eğitimi + entegrasyonu | 120 saat |
| Sprint 6 | SonarQube, Doxygen, kullanıcı kılavuzu, video | 157 saat |
| **TOPLAM** | | **847 saat** |

---

## 8. Sonuç

UCP yöntemi ile yapılan hesap, bu projenin **~847 adam/saat** emek gerektirdiğini göstermektedir. 2 kişilik takım için kişi başına yaklaşık 424 saat çalışma anlamına gelir. Bu da bir akademik dönem (15 hafta) içinde haftalık ~28 saat (kişi başı ~14 saat) çalışma ile tamamlanabilecek bir proje büyüklüğüdür.

UCP değerini yükselten ana faktörler AI modeli eğitimi (karmaşık iç işleme T4=4), taşınabilirlik (T8=3, ağırlığı 2.0) ve gereksinim kararlılığıdır (E6=4, ağırlığı 2.0). Düşüren ana faktörler ise eş zamanlılık ihtiyacının düşük olması (T10=1) ve güvenlik gereksinimlerinin minimum tutulmasıdır (T11=1).

Sonuç birimi **adam/saat** cinsindendir.

---

## Kaynakça

- Karner, G. (1993). *Resource estimation for objectory projects*. Objective Systems SF AB.
- IEEE 14143-1:2007 *Information Technology — Software Measurement — Functional Size Measurement*.
- Cohn, M. (2005). *Agile Estimating and Planning*. Prentice Hall.
