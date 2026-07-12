TODO

-   [ ] Review TherapySession component and existing lesson plan data shape
-   [ ] Implement lesson plan draft form in TherapySession.tsx
-   [ ] Pre-fill form from existing lessonPlan (activities/goals/home_program/therapist_note/session_date/session_number)
-   [ ] Submit handler to POST to route('therapy-session.lesson-plans.save') with activities payload
-   [ ] Ensure validation aligns with backend (activities.\*.activity_name required, objective nullable but UI should fill existing; at least keep objective field)
-   [ ] Run lint/build/test command to ensure TS/compile success
