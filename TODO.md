# TODO: Perbaikan Error `lessonPlan.home_program.map is not a function`

## Rencana

Menambahkan defensive normalization pada semua komponen yang menggunakan `.map()` pada `home_program`.

## Files to Edit

-   [x] `resources/js/components/lessonPlan/LessonPlanDetail.tsx`
-   [x] `resources/js/components/therapy/LessonPlanCard.tsx`
-   [x] `resources/js/Pages/OrangTua/Therapy/components/HomeProgramCard.tsx`
-   [ ] `npm run build` verification

## Steps

1. Normalize `home_program` menggunakan helper function sebelum dipanggil `.map()`
2. Test dengan `npm run build`
