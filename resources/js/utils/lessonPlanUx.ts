export type LessonPlanFieldKey =
  | "schedule_id"
  | "session_date"
  | "session_number"
  | "long_term_goal"
  | "short_term_goal"
  | "goal"
  | "activities"
  | "therapist_note"
  | "home_program"
  | "evaluation"
  | "ling_six_sounds"
  | `activities.${number}.activity_name`
  | `activities.${number}.score`
  | `ling_six_sounds.${number}.sound`
  | `ling_six_sounds.${number}.level`
  | `evaluation.${string}`;

export type LessonPlanSectionKey =
  | "Session Information"
  | "Therapy Goals"
  | "Activity"
  | "Ling Six Sound"
  | "Evaluation"
  | "Home Program"
  | "Therapist Note"
  | "Patient Information";

const labelMap: Partial<Record<string, string>> = {
  schedule_id: "Jadwal Terapi",
  session_date: "Tanggal Sesi",
  session_number: "Nomor Sesi",
  long_term_goal: "Tujuan Jangka Panjang",
  short_term_goal: "Tujuan Jangka Pendek",
  activities: "Aktivitas Terapi",
  therapist_note: "Catatan Terapis",
  home_program: "Program Rumah",
  evaluation: "Evaluasi",
  ling_six_sounds: "Hasil Ling Six Sound",

  // allow direct mapping for nested keys (e.g. activities.0.activity_name)
  // by extracting the first segment.
  "activities.activity_name": "Nama Aktivitas",
  "activities.score": "Skor",
  "ling_six_sounds.sound": "Suara",
  "ling_six_sounds.level": "Tingkat",
};

function normalizeFieldKey(fieldKey: string) {
  return fieldKey.trim();
}

/**
 * Extracts a stable "top-level" field to use for label:
 * - activities.0.activity_name -> activities.activity_name
 * - ling_six_sounds.1.sound -> ling_six_sounds.sound
 * - evaluation.key -> evaluation
 */
export function getLessonPlanLabel(fieldKey: string): string | null {
  const k = normalizeFieldKey(fieldKey);

  if (labelMap[k]) return labelMap[k]!;

  // nested patterns
  if (k.startsWith("activities.")) {
    const tail = k.replace(/^activities\.\d+\./, "activities.");
    return labelMap[tail] ?? labelMap.activities ?? null;
  }

  if (k.startsWith("ling_six_sounds.")) {
    const tail = k.replace(/^ling_six_sounds\.\d+\./, "ling_six_sounds.");
    return labelMap[tail] ?? labelMap.ling_six_sounds ?? null;
  }

  if (k.startsWith("evaluation.")) {
    return labelMap.evaluation ?? null;
  }

  return labelMap[k] ?? null;
}

export function getLessonPlanSectionKey(fieldKey: string): LessonPlanSectionKey | null {
  const k = normalizeFieldKey(fieldKey);

  if (k === "schedule_id" || k === "session_date" || k === "session_number") {
    return "Session Information";
  }

  if (k === "long_term_goal" || k === "short_term_goal" || k === "goal") {
    return "Therapy Goals";
  }

  if (k.startsWith("activities." ) || k === "activities") {
    return "Activity";
  }

  if (k.startsWith("ling_six_sounds.") || k === "ling_six_sounds") {
    return "Ling Six Sound";
  }

  if (k.startsWith("evaluation.") || k === "evaluation") {
    return "Evaluation";
  }

  if (k === "home_program") {
    return "Home Program";
  }

  if (k === "therapist_note") {
    return "Therapist Note";
  }

  // patient exists in form for lesson plan, but may not be a required frontend key in schema
  return null;
}

export function getLessonPlanTopLevelFieldKeysFromErrors(errors: Record<string, string>): string[] {
  const out = new Set<string>();

  for (const key of Object.keys(errors)) {
    if (!errors[key]) continue;

    if (key.startsWith("activities.")) out.add("activities");
    else if (key.startsWith("ling_six_sounds.")) out.add("ling_six_sounds");
    else if (key.startsWith("evaluation.")) out.add("evaluation");
    else if (key === "activities" || key === "ling_six_sounds" || key === "evaluation") out.add(key);
    else out.add(key);
  }

  return Array.from(out);
}
