# Audit Frontend Dashboard Pimpinan – Tahapan Rekomendasi

## Ringkasan Temuan
- **Secret terbuka di repo**: `env.example` berisi token aktif (OpenRouter, TOKEN_DASHBOARD, TOKEN_SPLP, password SPLP). Sudah terekspos di git.
- **Token disimpan di folder publik**: `src/libs/utils/cron.ts` menulis token SPLP ke `public/static/file/token.json` dan dipanggil dari `src/app/layout.tsx`, sehingga file ini bisa diakses publik dan otomatis direfresh tiap 5 menit.
- **Proteksi API lemah/CSRF**: `src/middleware.ts` hanya memeriksa `referer/origin` untuk rute `/api/*`, tanpa autentikasi; mudah dipalsukan. SSO guard di `src/components/SsoGuard.tsx` hanya client-side, tidak mengunci API.
- **Log mencurigakan**: PM2 log berisi output buffer “Connecting to 5.255.121.141:80” dan “wow i guess im finna bridge now”; indikasi proses mencoba mengunduh dari host eksternal yang tidak dikenal.
- **Koneksi keluar luas**: Aplikasi memanggil berbagai host (IP privat 10.255.100.81, bantenprov.go.id, layanan.go.id, api-dashboard.bantenprov.go.id, OpenRouter). Belum ada pembatasan egress/allowlist.

## Tahapan Rekomendasi (prioritas)
1) **Segera rotasi semua kredensial** yang sudah tercantum di `env.example` dan yang tersimpan di PM2 lingkungan produksi. Buat contoh `.env.example` baru tanpa nilai sensitif.
2) **Pindahkan penyimpanan token ke server-only**: jangan simpan di `public/`. Simpan di storage privat (filesystem di luar `public`, DB, atau secret store) dan hentikan import `src/libs/utils/cron.ts` di `src/app/layout.tsx` agar cron tidak jalan di proses Next. Jalankan refresh token di service/background terpisah.
3) **Perketat autentikasi API**: tambahkan validasi sesi/SSO di server (middleware atau handler) dan jangan hanya mengandalkan `referer/origin`. Minimalkan surface dengan path allowlist dan token/service account khusus backend.
4) **Investigasi log mencurigakan**: telusuri `pm2 logs frontend-terasdata --lines 200` dan audit proses/cron lain yang mungkin memanggil `5.255.121.141`. Cek apakah ada file/dropper yang terunduh; bila ragu, redeploy dari sumber bersih.
5) **Batasi egress dan header keamanan**: gunakan firewall/ACL untuk hanya mengizinkan host yang diperlukan (10.255.100.81, bantenprov.go.id, layanan.go.id, dll). Tambahkan HTTP security headers dan aktifkan `NODE_ENV=production` saat runtime.
6) **Hardening repositori**: hapus artefak token yang mungkin tersisa di `public/static/file/`, tambahkan `.gitignore` untuk file rahasia, dan tambahkan pemeriksaan `yarn lint`/audit pada pipeline. Dokumentasikan alur SSO/API dan uji akses tanpa kredensial untuk memastikan penolakan.
