# AutoRent — Araç Kiralama Sitesi

Next.js 15 (App Router) + Tailwind CSS v4 ile yazılmış, Supabase destekli araç
kiralama sitesi. Ziyaretçiler rezervasyon talebi bırakır, talepler veritabanına
kaydedilir ve GateHub ile korunan yönetim panelinden yönetilir.

## Özellikler

- **Tek sayfa tanıtım sitesi** — 5 dil (TR/EN/DE/ES/FR), istemci tarafı sözlükle
- **Veritabanı destekli filo** — araçlar `rental_cars` tablosundan okunur, fiyat
  değişikliği için deploy gerekmez
- **Rezervasyon sistemi** — talepler `rental_bookings` tablosuna yazılır, ardından
  hazır WhatsApp mesajı açılır
- **Müsaitlik kontrolü** — seçilen tarihlerde araç doluysa ziyaretçi uyarılır
- **Yönetim paneli** (`/admin`) — talepleri onaylama/iptal etme, filo düzenleme
- **SEO** — metadata, sitemap, robots, üretilen OG görseli, JSON-LD (`AutoRental`)
- **Analitik** — Vercel Analytics + Speed Insights

## Kurulum

```bash
npm install
cp .env.example .env.local
```

`.env.local` içindeki değerleri doldurun (ayrıntılar dosyanın içinde).

```bash
npm run dev
```

Site `http://localhost:3100` adresinde açılır.

### GateHub OAuth kaydı (yönetim paneli girişi için)

Yönetim paneli, kendi barındırdığınız GateHub kimlik sağlayıcısıyla korunur.
Kayıt, GateHub'ın kendi arayüzünden yapılmalıdır — client secret veritabanında
SHA-256 hash olarak saklandığı için elle SQL ile kayıt eklenemez.

1. GateHub'ı çalıştırıp `/dashboard` sayfasını açın
2. "Yeni uygulama" formunu doldurun:
   - **Ad**: `carrenting`
   - **Redirect URI**: `http://localhost:3100/api/auth/callback/gatehub`
     (production için kendi alan adınızla aynı yolu ekleyin)
3. Bir kez gösterilen `client_id` ve `client_secret` değerlerini `.env.local`
   dosyasındaki `GATEHUB_CLIENT_ID` / `GATEHUB_CLIENT_SECRET` alanlarına yazın
4. `ADMIN_EMAILS` alanına panele girebilecek e-posta adres(ler)ini yazın

## Veritabanı

Tablolar Supabase'deki **receiptflow** projesinde `rental_` önekiyle durur:

| Tablo | Amaç |
| --- | --- |
| `rental_cars` | Filo: model, tip, koltuk, vites, günlük fiyat, sıra, yayın durumu |
| `rental_bookings` | Rezervasyon talepleri: müşteri, tarih aralığı, araç, durum |

Her iki tabloda RLS açıktır ve **hiç policy yoktur** — yani anon anahtarıyla
dışarıdan erişilemez. Tüm okuma/yazma, Next.js sunucu tarafında `service_role`
anahtarıyla yapılır (`src/lib/supabase.ts`).

## Komutlar

```bash
npm run dev     # geliştirme sunucusu (port 3100)
npm run build   # production derlemesi
npm run start   # derlenmiş uygulamayı çalıştırır
npm run lint    # tsc --noEmit ile tip kontrolü
```

## Vercel'e dağıtım

1. Projeyi Vercel'e bağlayın
2. `.env.example` içindeki tüm değişkenleri Vercel proje ayarlarına ekleyin
3. `NEXT_PUBLIC_SITE_URL` değerini gerçek alan adınıza ayarlayın
4. GateHub'daki uygulama kaydına production redirect URI'sini de ekleyin

## Proje yapısı

```
src/
├── auth.ts                 NextAuth + GateHub OIDC yapılandırması
├── middleware.ts           /admin korumasi
├── lib/
│   ├── supabase.ts         service_role istemcisi (server-only)
│   ├── rental.ts           veri erişim fonksiyonları
│   ├── types.ts            paylaşılan tipler
│   ├── format.ts           fiyat/tarih biçimlendirme
│   └── site.ts             kanonik site adresi
└── app/
    ├── page.tsx            ana sayfa (server) + JSON-LD
    ├── HomeContent.tsx     tüm arayüz ve dil sözlüğü (client)
    ├── actions.ts          rezervasyon server action'ı
    ├── admin/              yönetim paneli
    └── components/         LanguageSwitcher, Weather, Maps
```
