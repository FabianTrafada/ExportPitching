# Laporan TEFA: ExportPitching Website

## 1. Pendahuluan
ExportPitching adalah platform practice pitching berbasis web yang dirancang untuk membantu pengguna mempersiapkan dan mengevaluasi presentasi bisnis melalui sesi latihan dan feedback otomatis maupun manual.

## 2. Ringkasan Fitur Utama
- Autentikasi dan otorisasi pengguna (Clerk.js)
- Halaman practice pitch dengan template yang dapat dipilih
- Sesi latihan pitching yang terekam dengan timestamp
- Sistem feedback lengkap dengan skor total, kategori, strengths & areas for improvement
- Admin Dashboard: analytics & laporan (user growth, sessions by day, template usage, difficulty distribution)
- Manajemen pengguna, template, dan konten melalui admin UI

## 3. Arsitektur & Teknologi
- Framework: Next.js (App Router, React 18, TypeScript)
- UI: Tailwind CSS, Radix UI components, Recharts untuk visualisasi
- Autentikasi: Clerk.js middleware & hooks
- Database: PostgreSQL (Neon), Drizzle ORM untuk query builder
- Server Actions: fungsi di `/src/actions` untuk fetch data chart dan operasi server-side
- Middleware: proteksi route non-public

## 4. Struktur Proyek
```
/  
├─ .next/       # build artifacts
├─ public/      # static assets
├─ src/
│  ├─ app/      # halaman dan layout Next.js
│  │  ├─ (auth)/sign-in, sign-up
│  │  ├─ practice/[id]/page.tsx
│  │  ├─ admin/
│  │  │  ├─ reports/page.tsx
│  │  │  └─ users, templates
│  │  └─ api/   # webhooks, popular-template
│  ├─ actions/  # server actions (report, session, feedback)
│  ├─ db/       # schema.ts, neon.ts
│  ├─ lib/      # helper functions
│  └─ components/ # UI reusable
├─ next.config.ts
├─ server.js    # custom server entry
└─ tsconfig.json
```

## 5. Skema Database
- users: user profile & credential
- practice_templates: metadata template pitching (difficulty, industry, questions)
- pitching_sessions: sesi latihan user dengan referensi template
- pitch_feedback: hasil skor dan komentar per sesi
- notification_preferences: preferensi alert email/feedback

## 6. Alur Pengguna
1. Registrasi dan login melalui Clerk.js
2. Pilih template practice sesuai industri dan tingkat kesulitan
3. Mulai sesi pitching; sistem merekam waktu dan metadata
4. Feedback otomatis dan manual disimpan di database
5. Admin dapat memantau metrik penggunaan dan performa

## 7. Analytics & Reporting
- Kode di `src/app/admin/reports/page.tsx` mengintegrasikan Recharts untuk:
  - Pertumbuhan pengguna (LineChart)
  - Aktivitas sesi per hari (BarChart)
  - Popularitas template (PieChart)
  - Distribusi tingkat kesulitan (PieChart)
- Data diambil lewat `/src/actions/report.actions.ts`

## 8. Deployment & Konfigurasi
- next.config.ts: konfigurasi Next.js
- server.js: custom Express-like server
- Environment variables untuk koneksi Neon DB, Clerk API
- Middleware untuk proteksi route dan file static

## 9. Rekomendasi & Roadmap
- Fitur ekspor laporan (PDF/Excel) untuk dashboard admin
- Integrasi CI/CD (GitHub Actions/Vercel) untuk otomatisasi build & deploy
- Monitoring performa (Sentry/Datadog) dan logging
- Penambahan unit & integration tests (Jest, React Testing Library)
- Optimalisasi SEO dan UX (loading state, skeleton screens)

## 10. Kesimpulan
ExportPitching telah menyediakan fondasi yang kuat untuk latihan pitching dengan monitoring dan feedback lengkap. Langkah berikutnya adalah meningkatkan kemampuan reporting, menambahkan otomatisasi, dan memperkuat kualitas kode melalui testing.

---
*Dokumen ini disusun berdasarkan struktur dan kode sumber yang ada. Mohon feedback dan pertimbangan lanjutan.* 