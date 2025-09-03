# The Mind - Modern Web Oyunu

**The Mind** oyununun modern, animasyonlu, serverless web klonu. Firebase ile gerçek zamanlı çok oyunculu deneyim.

## 🎮 Oyun Hakkında

The Mind, oyuncuların kartlarını sırayla oynaması gereken bir işbirliği oyunudur. Kartlar 1-100 arasında numaralandırılmıştır ve oyuncular kartlarını en düşük sayıdan başlayarak sırayla oynamalıdır. Eğer bir oyuncu yanlış sırada kart oynarsa, diğer oyuncuların elindeki daha düşük kartlar otomatik olarak "yanar" ve can kaybedilir.

## ✨ Özellikler

- 🔥 **Gerçek Zamanlı Çok Oyunculu**: Firebase Firestore ile anlık senkronizasyon
- 🎨 **Modern UI**: Glassmorphism tasarım, Framer Motion animasyonları
- 🔐 **Güvenli**: Firestore güvenlik kuralları ile oyuncular sadece kendi kartlarını görebilir
- 📱 **Responsive**: Mobil ve masaüstü uyumlu
- ⚡ **Serverless**: Özel sunucu gerektirmez, Firebase ile çalışır
- 🎯 **Deterministik**: Seed tabanlı karıştırma ile tutarlı oyun deneyimi

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- Firebase projesi

### Adımlar

1. **Projeyi klonlayın**
   ```bash
   git clone <repo-url>
   cd the-mind-game
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Firebase projesi oluşturun**
   - [Firebase Console](https://console.firebase.google.com/)'a gidin
   - Yeni proje oluşturun
   - Authentication'ı etkinleştirin (Anonymous auth)
   - Firestore Database'i oluşturun

4. **Environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   `.env.local` dosyasını Firebase proje ayarlarınızla doldurun:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   ```

5. **Firestore kurallarını deploy edin**
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

## 🏗️ Mimari

```
src/
├── lib/           # Utility fonksiyonları
│   ├── firebase.ts    # Firebase konfigürasyonu
│   ├── rng.ts         # Deterministik RNG
│   └── shuffle.ts     # Kart karıştırma
├── store/         # Zustand state yönetimi
│   ├── useAuth.ts     # Authentication
│   ├── usePresence.ts # Oyuncu presence
│   └── useRoom.ts     # Oda yönetimi
├── game/          # Oyun mantığı
│   ├── types.ts       # Tip tanımları
│   ├── rules.ts       # Oyun kuralları
│   └── reducer.ts     # Durum hesaplama
└── components/    # UI bileşenleri
    ├── ui/           # shadcn/ui bileşenleri
    ├── Card.tsx      # Kart bileşeni
    ├── Hand.tsx      # El bileşeni
    ├── GameBoard.tsx # Oyun tahtası
    └── Lobby.tsx     # Lobi
```

## 🎯 Oyun Kuralları

1. **Başlangıç**: Her oyuncuya seviye sayısı kadar kart dağıtılır
2. **Oynama**: Oyuncular kartlarını en düşük sayıdan başlayarak sırayla oynamalı
3. **Yanma**: Yanlış sırada oynanan karttan daha düşük kartlar otomatik yanar
4. **Canlar**: Her hata 1 can kaybına neden olur
5. **Shuriken**: Tüm oyuncuların en düşük kartını yakar (hata sayılmaz)
6. **Seviye**: Tüm kartlar oynandığında seviye tamamlanır

## 🧪 Test

```bash
npm test
```

## 📦 Build

```bash
npm run build
```

## 🚀 Deployment

### Netlify

1. Netlify'da yeni site oluşturun
2. Git repository'nizi bağlayın
3. Build komutu: `npm run build`
4. Publish directory: `dist`
5. Environment variables'ları Netlify'da ayarlayın

### Vercel

1. Vercel'de yeni proje oluşturun
2. Git repository'nizi bağlayın
3. Environment variables'ları ayarlayın
4. Deploy edin

## 🔧 Teknolojiler

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State**: Zustand
- **Backend**: Firebase (Auth, Firestore)
- **UI**: shadcn/ui, Lucide React
- **Testing**: Vitest, Testing Library

## 📄 Lisans

MIT

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilirsiniz.


