# TODO - Refactor Dashboard Orang Tua menjadi Modular

## Tahap 1 — Dashboard (Overview)

-   [ ] Buat folder & page baru: `resources/js/Pages/OrangTua/Dashboard/index.tsx`
-   [ ] Buat komponen card untuk overview:
    -   [ ] `WelcomeBanner.tsx`
    -   [ ] `ChildProfileCard.tsx`
    -   [ ] `TherapySummaryCard.tsx`
    -   [ ] `CurrentGoalCard.tsx`
    -   [ ] `NextScheduleCard.tsx`
-   [ ] Pastikan Dashboard hanya menampilkan:
    -   Welcome Banner
    -   Child Profile
    -   Therapy Summary (Total Session/Completed Session/Current Progress)
    -   Current Therapy Goal
    -   Next Therapy Schedule
-   [ ] Update `app/Http/Controllers/OrangTua/DashboardController.php` agar Inertia render mengarah ke `OrangTua/Dashboard/index`
-   [ ] Update `routes/web.php` agar `/dashboard-orangtua` merender `OrangTua/Dashboard/index` (konvensi Inertia)
-   [ ] Jalankan typecheck/build dan pastikan page `/dashboard-orangtua` bisa dirender tanpa error

## Tahap Selanjutnya (Belum dikerjakan)

-   [ ] OrangTua/Therapy - pindahkan Therapy data & UI
-   [ ] OrangTua/ChildProgress - pindahkan progress monitoring
-   [ ] OrangTua/ProgressReports - pindahkan list report & filtering/export (jika ada)
