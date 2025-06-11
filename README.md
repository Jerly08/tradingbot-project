# Trading Bot dengan DMI/ADX Strategy

Aplikasi web untuk mengonfigurasi dan menjalankan strategi trading otomatis berdasarkan indikator DMI/ADX. Terintegrasi dengan TradingView untuk sinyal dan Binance untuk simulasi trading.

## Fitur

- Form input strategi dan pengaturan risiko
- Tampilan konfigurasi aktif
- Webhook untuk menerima sinyal dari TradingView
- Validasi sinyal trading berdasarkan DMI/ADX
- Simulasi order dengan Take Profit dan Stop Loss
- Riwayat order trading

## Teknologi

- Frontend: Next.js dengan Tailwind CSS
- Backend: Next.js API Routes (Serverless)
- Database: MongoDB Atlas
- Integrasi: Binance API (Testnet)

## Pengaturan Default

| Parameter | Nilai Default |
|-----------|---------------|
| Symbol | BTCUSDT |
| Timeframe | 5m |
| +DI Threshold | 25 |
| –DI Threshold | 20 |
| ADX Minimum | 20 |
| Take Profit (%) | 2 |
| Stop Loss (%) | 1 |
| Leverage | 10x |

## Instalasi

1. Clone repositori ini
2. Install dependensi:

```bash
npm install
```

3. Buat file `.env.local` dengan konfigurasi MongoDB dan Binance API:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trading_bot
MONGODB_TIMEOUT=20000

# Binance API Configuration
BINANCE_API_KEY=your_binance_testnet_api_key
BINANCE_API_SECRET=your_binance_testnet_api_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Jalankan aplikasi dalam mode development:

```bash
npm run dev
```

## Deployment

Aplikasi ini dapat di-deploy ke Vercel dengan mudah. Pastikan untuk mengatur environment variables yang sama di dashboard Vercel.

## TradingView Webhook Setup

Untuk menggunakan aplikasi ini dengan TradingView:

1. Buat alert di TradingView yang mengirimkan nilai DMI/ADX
2. Gunakan webhook URL: `https://your-app-url.vercel.app/api/webhook`
3. Format payload yang dikirim:

```json
{
  "symbol": "BTCUSDT",
  "plusDI": 27.5,
  "minusDI": 15.0,
  "adx": 25.0,
  "timeframe": "5m"
}
```

## Mendapatkan API Key Binance Testnet

1. Kunjungi [Binance Testnet](https://testnet.binancefuture.com/)
2. Daftar akun dan login
3. Buka "API Management" dan buat API key baru
4. Salin API Key dan Secret key ke file `.env.local`

## Aturan Trading

- BUY jika:
  - +DI > threshold
  - –DI < threshold
  - ADX > minimum
- SELL jika:
  - +DI < threshold
  - –DI > threshold
  - ADX > minimum

## Lisensi

MIT
