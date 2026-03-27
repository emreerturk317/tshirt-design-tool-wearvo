# Wearvo — Product & Business Document
> *"Designed by you. Worn by the world."*

---

## 📌 Özet

Wearvo, kullanıcıların yapay zeka ile saniyeler içinde özgün t-shirt tasarımları yapabildiği, bu tasarımları başkalarına satabildiği ve her satıştan pasif kredi kazandığı bir print-on-demand platformudur. Tasarım bilgisi gerekmez. Üretim ve kargo Printify tarafından karşılanır.

---

## 🎯 Vizyon & Misyon

**Vizyon:** Herkesin bir tasarımcı olabildiği, her fikrin giyilebilir bir ürüne dönüşebildiği global bir yaratıcı topluluk.

**Misyon:** Yapay zeka ile tasarım engelini ortadan kaldırmak; insanların hem kendi tarzlarını ifade etmelerine hem de bu ifadeden gelir elde etmelerine olanak tanımak.

---

## 👤 Hedef Kitle

- **Birincil:** Tasarım bilgisi olmayan ama yaratıcı fikirleri olan herkes (18–45 yaş, global)
- **İkincil:** Pasif gelir arayan içerik üreticileri ve hobiciler
- **Üçüncül:** Hediye almak isteyen, kişiselleştirilmiş ürün arayan alıcılar

---

## 💡 Ürün Konsepti

### Temel Döngü
```
Kullanıcı kayıt olur
  → AI ile t-shirt tasarlar (prompt girer)
  → Tasarımı beğenirse satın alır ve/veya galeriye açar
  → Başkası o tasarımı satın alır
  → Tasarımcı $2 kredi kazanır
  → Krediyle yeni t-shirt alır → döngü devam eder
```

### Temel Özellikler
- **AI Tasarım Stüdyosu:** Kullanıcı prompt girer, AI t-shirt mockup üzerinde tasarım üretir
- **Public / Private Toggle:** Tasarım galeriye açılabilir veya sadece kişisel kullanım için saklanabilir
- **Kredi Sistemi:** Her satışta tasarımcıya $2 site kredisi — sadece platformda harcanabilir
- **Günlük Üretim Limiti:** Ücretsiz hesaplara günde 3 AI üretim hakkı
- **Bildirim Sistemi:** Biri tasarımını satın alınca sinematik bildirim ekranı

---

## 🗺️ Sitemap

### Public Sayfalar
| Sayfa | URL | Açıklama |
|---|---|---|
| Ana Sayfa | `/` | Hero + trending galeri |
| Keşfet | `/explore` | Tüm public tasarımlar, filtreli |
| Tasarım Detay | `/product/:id` | Tek tasarım sayfası, satın al |
| Giriş | `/login` | Email veya Google ile giriş |
| Kayıt | `/register` | Hesap oluştur |

### Authenticated Sayfalar
| Sayfa | URL | Açıklama |
|---|---|---|
| Tasarım Stüdyosu | `/design` | AI tasarım arayüzü ⭐ |
| Ödeme | `/checkout` | Beden, adres, ödeme |
| Dashboard | `/dashboard` | Kullanıcı paneli |
| Tasarımlarım | `/dashboard/designs` | Kişisel tasarım galerisi |
| Kredilerim | `/dashboard/credits` | Kredi geçmişi ve kazançlar |
| Siparişlerim | `/dashboard/orders` | Sipariş takibi |
| Ayarlar | `/settings` | Hesap bilgileri |

### Admin
| Sayfa | URL | Açıklama |
|---|---|---|
| Admin Panel | `/admin` | Sipariş, kullanıcı, moderasyon |

---

## 🔄 Kullanıcı Akışları

### Akış 1 — Yeni Ziyaretçi, Satın Alır
```
/ → /product/:id → /register → /checkout → Sipariş Onayı
```

### Akış 2 — Kayıtlı Kullanıcı, Tasarlar
```
/login → /design
  → T-shirt tipi & renk seç
  → Prompt yaz → AI üretir
  → Beğenirse: public/private seç
  → Satın al veya sadece yayınla
```

### Akış 3 — Pasif Gelir Döngüsü
```
Başkası tasarımı satın alır
  → $2 kredi hesaba düşer
  → Sinematik bildirim ekranı gösterilir
  → Kullanıcı paylaşır / yeni tasarım yapar
```

---

## 🎨 /design Sayfası — Detaylı Akış

```
┌─────────────────────────────────────────┐
│  1. T-Shirt Tipi Seç                    │
│     [ Unisex ]  [ Kadın ]  [ Çocuk ]   │
│     Renk paleti (15 renk seçeneği)      │
├─────────────────────────────────────────┤
│  2. Tasarımını Anlat                    │
│     [ Prompt kutusu                   ] │
│     💡 "İpuçları" linki                │
│     [ Tasarla → ]                       │
├─────────────────────────────────────────┤
│  3. Önizleme                            │
│     T-shirt mockup üzerinde görüntüle   │
│     [ Tekrar Üret ]  [ Beğendim ✓ ]    │
├─────────────────────────────────────────┤
│  4. Yayınla & Satın Al                  │
│     🌍 Public  /  🔒 Private           │
│     Beden: XS S M L XL 2XL 3XL        │
│     [ Devam → Ödeme ]                   │
└─────────────────────────────────────────┘
```

---

## 💰 Birim Ekonomisi

| Kalem | Tutar |
|---|---|
| Satış fiyatı | $24.99 |
| Printify maliyeti (üretim + kargo) | -$12.00 |
| Tasarımcı kredisi | -$2.00 |
| Stripe işlem ücreti (~3%) | -$0.75 |
| AI görsel üretim maliyeti | -$0.05 |
| **Net kâr (satış başına)** | **~$10.19** |
| **Margin** | **~%40** |

---

## 📈 Senaryo Analizi (Aylık)

| Senaryo | Aylık Sipariş | Brüt Gelir | Net Kâr |
|---|---|---|---|
| 🐢 Muhafazakâr | 100 | $2.499 | ~$1.020 |
| 🚀 Büyüme | 500 | $12.495 | ~$5.095 |
| 🔥 Viral | 2.000 | $49.980 | ~$20.380 |

### Break-even Noktası
Aylık sabit gider ~$120 → Sadece **12 satış** tüm gideri karşılar.

---

## 💸 Başlangıç Giderleri

| Kalem | Aylık Maliyet |
|---|---|
| Domain + Hosting (Vercel) | ~$5 |
| Veritabanı (Supabase) | ~$0–25 |
| AI API (Ideogram / Flux) | ~$50–100 |
| Stripe | İşlem başına %2.9+$0.30 |
| Printify | Ücretsiz |
| **Toplam** | **~$55–130/ay** |

---

## 🏆 Rakip Analizi

| Platform | Güçlü Yön | Zayıf Yön | Wearvo Farkı |
|---|---|---|---|
| Redbubble | Büyük marketplace | Trafik düştü, AI yok | AI + kredi döngüsü |
| Threadless | Community odaklı | Kendi trafiğini kendin getirirsin | Otomatik büyüme motoru |
| Kittl | AI tasarım araçları | Marketplace yok | Uçtan uca deneyim |
| Merch by Amazon | Dev kitle | 25 tasarım limiti, AI yok | Sınırsız + AI |

### Wearvo'nun Eşsiz Kombinasyonu
Hiçbir platform şu 3'ünü bir arada sunmuyor:
1. ✅ AI ile tasarım (sıfır tasarım bilgisi gerekmiyor)
2. ✅ Anında satın alma + kargo (Printify)
3. ✅ Pasif gelir döngüsü (kredi sistemi)

---

## 🎮 Oyunlaştırma Sistemi

### Satış Bildirimi
Biri tasarımı satın alınca:
- Ekranda konfeti animasyonu
- Sinematik kart: *"Your art is on its way to Tokyo 🇯🇵"*
- *"+$2.00 credit added to your wallet"*
- Paylaş butonu → organik marketing

### Rozet Sistemi
| Rozet | Koşul |
|---|---|
| 🌱 First Drop | İlk tasarımı yayınladın |
| 🔥 Hot Designer | Tasarım 10 kez satıldı |
| 💎 Top Creator | Bu ayın en çok satan tasarımcısı |
| 🌍 Global | 5 farklı ülkeye satış |
| 👑 Legend | 100 toplam satış |

### Streak Sistemi
- Ardışık günlerde siteye giriş + tasarım yapma
- "3 günlük seri!" → bonus kredi
- Streak kırılırsa hatırlatma e-postası

### Trending Şeridi
- Ana sayfada bu haftanın en çok satılan 5 tasarımı
- Herkes orada görünmek ister → daha fazla tasarım yapılır

### Kişisel İstatistikler
- Dünya haritasında satış noktaları
- *"Your designs have traveled to 12 countries 🌍"*
- Aylık kredi kazanç grafiği

---

## 🎨 Marka Kimliği

### İsim
**Wearvo** — "Wear your voice" alt anlamı taşır. Global, telaffuzu kolay, premium hissettiriyor.

### Slogan
*"Designed by you. Worn by the world."*

### Tasarım Dili
- **Stil:** Minimalist & premium (Apple Store + Figma arası)
- **Arka plan:** Saf beyaz / çok açık gri
- **Ana renkler:** Siyah + beyaz
- **Accent renk:** Tek bir canlı renk (sadece CTA butonlarında)
- **Typography:** Geometrik sans-serif — Inter veya Neue Haas Grotesk
- **Logo:** Sadece wordmark, ikon yok

---

## 🛠️ Teknik Stack

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js (App Router) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| AI Görsel | Ideogram API veya Flux (Black Forest Labs) |
| Ödeme | Stripe |
| Üretim & Kargo | Printify API |
| Hosting | Vercel |
| Email | Resend |

---

## 🗓️ MVP Yol Haritası

### Faz 1 — MVP (0–6 hafta)
- [ ] Auth sistemi (kayıt, giriş)
- [ ] AI tasarım stüdyosu (prompt → mockup)
- [ ] Printify entegrasyonu
- [ ] Stripe ödeme
- [ ] Public galeri
- [ ] Kredi sistemi temeli

### Faz 2 — Büyüme (6–12 hafta)
- [ ] Sinematik satış bildirimi
- [ ] Rozet sistemi
- [ ] Streak sistemi
- [ ] Dashboard istatistikleri (dünya haritası)
- [ ] Trending şeridi
- [ ] Paylaşım özellikleri

### Faz 3 — Ölçekleme (3–6 ay)
- [ ] Premium hesap (günlük limit kaldırma)
- [ ] Hoodie, kupa, poster gibi yeni ürünler
- [ ] Koleksiyon sistemi
- [ ] Affiliate / referral programı
- [ ] Mobile app

---

## ⚠️ Riskler & Azaltma Stratejileri

| Risk | Olasılık | Azaltma |
|---|---|---|
| AI maliyet artışı | Orta | Günlük üretim limiti + premium upsell |
| Büyük oyuncuların girmesi | Yüksek | Hızlı MVP + güçlü community |
| AI içerik moderasyon | Orta | Prompt filtreleme + moderasyon kuyruğu |
| Printify gecikmeleri | Düşük | SLA takibi + alternatif sağlayıcı (Printful) |
| Düşük dönüşüm oranı | Orta | A/B test + onboarding optimizasyonu |

---

*Son güncelleme: 2026 • Wearvo v1.0 Product Doc*
