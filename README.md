# Elara Journeys — Website

Website travel Elara Journeys (Next.js 16 + Tailwind v4 + shadcn/ui + PostgreSQL). Bahasa Inggris (default) + Bahasa Indonesia.

**Semua spesifikasi, keputusan teknis, daftar aset, dan urutan pengerjaan ada di [`CLAUDE.md`](./CLAUDE.md).**

## Isi folder

| Folder / file | Isi |
|---|---|
| `CLAUDE.md` | Panduan lengkap untuk Claude Code (fitur, struktur, database, urutan kerja) |
| `public/images/` | 14 foto destinasi, sudah dikonversi ke WebP (siap pakai di website) |
| `public/brand/` | Logo lengkap & logo "E" (latar transparan) |
| `src/app/icon.png`, `apple-icon.png` | Favicon dari logo |
| `src/components/ui/` | Komponen Anda: button, accordion, faqs-02, footer-column |
| `src/components/icons/brand.tsx` | Ikon WhatsApp, Instagram, TikTok, Facebook, YouTube |
| `src/lib/utils.ts` | Fungsi `cn()` dari komponen Anda |
| `src/app/globals.css` | Warna brand (diambil dari logo) + token shadcn |
| `assets/original-photos/` | Foto asli (cadangan, tidak dipakai langsung) |
| `assets/brand-source/` | Logo asli |
| `docs/` | Business Model Canvas, PDF blueprint, contoh demo FAQ |
| `.env.example` | Daftar variabel lingkungan (WhatsApp, database, Midtrans, email) |

## Mulai di VS Code

```bash
npm install
cp .env.example .env.local   # isi nomor WhatsApp, dll.
npm run dev                  # buka http://localhost:3000
```

Lalu buka Claude Code di folder ini dan ketik misalnya:
> Baca CLAUDE.md, lalu kerjakan milestone M1.

## Push ke GitHub

```bash
git remote -v                      # sudah diarahkan ke github.com/alettanikayla/elarajourneys
git push -u origin main
```
