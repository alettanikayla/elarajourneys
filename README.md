# Elara Journeys — Website (demo tugas sekolah)

Website travel Elara Journeys (Next.js 16 + Tailwind v4 + shadcn/ui). Bahasa Inggris (default) + Bahasa Indonesia.
Semua spesifikasi ada di [`CLAUDE.md`](./CLAUDE.md).

> **Mode demo:** booking, pembayaran, Trip Saya, dan admin hanya simulasi (data tersimpan di browser). Tidak ada uang atau pemesanan sungguhan.

## Yang bisa dicoba saat presentasi

| Halaman | Apa yang ditunjukkan |
|---|---|
| `/` | Beranda, pencarian cepat, destinasi, "semua sudah diurus", tombol WhatsApp melayang |
| `/en/packages` | Daftar paket + filter (destinasi, bulan, durasi, jenis trip, harga) |
| `/id/packages/bromo-ijen-3d2n` | Detail paket + itinerary per jam (WIB/WITA) |
| `…/book` | Form booking: open/private trip, peserta, add-on fotografer, DP 30% |
| `/en/booking` | Konfirmasi + pembayaran demo (VA / QRIS / e-wallet) |
| `/en/my-trip` | Trip tracker. Klik **Try the demo trip** (`ELR-BAL4K7` / `demo@elarajourneys.com`) |
| `/en/custom-trip` | Form custom trip + lanjut ke WhatsApp |
| `/admin` | Panel admin. Password demo: **`elara2026`** |

## Jalankan di komputer

```bash
npm install
npm run dev          # buka http://localhost:3000
```

## Website live (Vercel)

1. Buka https://vercel.com → **Sign up with GitHub**.
2. **Add New → Project** → pilih repo `alettanikayla/elarajourneys` → **Deploy** (tidak perlu mengubah pengaturan).
3. Setelah itu setiap `git push` ke `main` otomatis meng-update website live.
