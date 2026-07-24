import { betweenNumber, inSet, integer, minNumber, required, stringTrimmedMax } from "@/validators/common";

export type LessonPlanCreateData = {
  schedule_id: string | number;
  session_date: string;
  session_number: number | string;
  goal?: string | null;

  activities: Array<{
    activity_name: string;
    objective?: string | null;
    score?: number | string | null;
    observation?: string | null;
  }>;

  evaluation?: {
    listening?: number | string | null;
    speech?: number | string | null;
    language?: number | string | null;
    attention?: number | string | null;
    recommendation?: string | null;
  };

  ling_six_sounds?: Array<{
    sound?: string | null;
    level?: number | string | null;
    note?: string | null;
  }> | null;

  home_program?: any;
  therapist_note?: string | null;
};

export type LessonPlanEditData = {
  session_date: string;
  session_number: number | string;

  long_term_goal?: string | null;
  short_term_goal?: string | null;
  home_program?: string | null;

  therapist_note?: string | null;

  ling_six_sounds: Array<{
    sound?: string | null;
    level?: number | string | null;
    note?: string | null;
  }>;

  activities: Array<{
    activity_name: string;
    objective?: string | null;
    score?: number | string | null;
    observation?: string | null;
  }>;

  evaluation: {
    listening: number | string;
    speech: number | string;
    language: number | string;
    attention: number | string;
    recommendation?: string | null;
  };
};

export type Schema<TData> = {
  validate: (data: TData) => Record<string, string | undefined>;
};

function isPresent(val: unknown) {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim().length > 0;
  return true;
}

/**
 * CREATE schema (StoreLessonPlanRequest)
 */
export const lessonPlanCreateSchema: Schema<LessonPlanCreateData> = {
  validate: (data) => {
    const errors: Record<string, string | undefined> = {};

    const scheduleIdErr = required("Schedule wajib dipilih")(data.schedule_id);
    if (scheduleIdErr) errors["schedule_id"] = scheduleIdErr;

    const dateErr = required("Tanggal sesi wajib diisi")(data.session_date);
    if (dateErr) errors["session_date"] = dateErr;

    const snErr1 = required("Nomor sesi wajib diisi")(data.session_number);
    if (snErr1) errors["session_number"] = snErr1;
    else {
      const snErr2 = integer("Nomor sesi harus angka bulat")(data.session_number);
      if (snErr2) errors["session_number"] = snErr2;
      else {
        const snErr3 = minNumber(1, "Nomor sesi minimal 1")(Number(data.session_number));
        if (snErr3) errors["session_number"] = snErr3;
      }
    }

    if (!Array.isArray(data.activities) || data.activities.length < 1) {
      errors["activities"] = "Minimal harus ada satu aktivitas.";
    } else {
      data.activities.forEach((a, idx) => {
        const nameErr = required("Activity name wajib diisi")(a.activity_name);
        if (nameErr) errors[`activities.${idx}.activity_name`] = nameErr;
        else {
          const nameMaxErr = stringTrimmedMax(255, "Maksimal 255 karakter")(a.activity_name);
          if (nameMaxErr) errors[`activities.${idx}.activity_name`] = nameMaxErr;
        }

        if (a.score !== null && a.score !== undefined && a.score !== "") {
          const scoreIntErr = integer("Score harus angka bulat")(a.score);
          if (scoreIntErr) errors[`activities.${idx}.score`] = scoreIntErr;
          else {
            const scoreBetweenErr = betweenNumber(1, 5, "Score harus antara 1 dan 5")(Number(a.score));
            if (scoreBetweenErr) errors[`activities.${idx}.score`] = scoreBetweenErr;
          }
        }
      });
    }

    const evalObj = data.evaluation ?? {};

    // Evaluation fields: make them required to prevent "Column cannot be null" errors
    (["listening", "speech", "language", "attention"] as const).forEach((key) => {
      const v = (evalObj as any)[key];
      const labelMap: Record<string, string> = {
        listening: "Listening",
        speech: "Speech",
        language: "Language",
        attention: "Attention",
      };
      const reqErr = required(`${labelMap[key]} wajib diisi`)(v);
      if (reqErr) {
        errors[`evaluation.${key}`] = reqErr;
      } else {
        const intErr = integer(`Nilai ${key} harus angka bulat`)(v);
        if (intErr) errors[`evaluation.${key}`] = intErr;
        else {
          const bErr = betweenNumber(1, 5, "Nilai harus antara 1 dan 5")(Number(v));
          if (bErr) errors[`evaluation.${key}`] = bErr;
        }
      }
    });

    if (!isPresent(evalObj.recommendation)) {
      errors["evaluation.recommendation"] = "Rekomendasi wajib diisi";
    }

    const sounds = data.ling_six_sounds ?? [];
    if (Array.isArray(sounds) && sounds.length) {
      sounds.forEach((s, idx) => {
        const soundProvided = isPresent(s.sound);
        const levelProvided = isPresent(s.level);

        if (soundProvided) {
          const setErr = inSet(["m", "u", "i", "a", "sh", "s"], "Sound tidak valid")(String(s.sound));
          if (setErr) errors[`ling_six_sounds.${idx}.sound`] = setErr;
        }

        if (soundProvided || levelProvided) {
          const soundReq = required("Sound wajib diisi")(s.sound);
          if (soundReq) errors[`ling_six_sounds.${idx}.sound`] = soundReq;

          const levelIntErr = integer("Level harus angka bulat")(s.level);
          if (levelIntErr) errors[`ling_six_sounds.${idx}.level`] = levelIntErr;
          else {
            const bErr = betweenNumber(0, 5, "Level harus antara 0 dan 5")(Number(s.level));
            if (bErr) errors[`ling_six_sounds.${idx}.level`] = bErr;
          }
        }
      });
    }

    return errors;
  },
};

/**
 * EDIT schema (UpdateLessonPlanRequest)
 */
export const lessonPlanEditSchema: Schema<LessonPlanEditData> = {
  validate: (data) => {
    const errors: Record<string, string | undefined> = {};

    const dateErr = required("Tanggal sesi wajib diisi")(data.session_date);
    if (dateErr) errors["session_date"] = dateErr;

    const snErr1 = required("Nomor sesi wajib diisi")(data.session_number);
    if (snErr1) errors["session_number"] = snErr1;
    else {
      const snErr2 = integer("Nomor sesi harus angka bulat")(data.session_number);
      if (snErr2) errors["session_number"] = snErr2;
      else {
        const snErr3 = minNumber(1, "Nomor sesi minimal 1")(Number(data.session_number));
        if (snErr3) errors["session_number"] = snErr3;
      }
    }

    if (!Array.isArray(data.ling_six_sounds) || data.ling_six_sounds.length < 1) {
      errors["ling_six_sounds"] = "Data Ling Six wajib diisi.";
    } else {
      data.ling_six_sounds.forEach((s, idx) => {
        const soundReq = required("Sound wajib diisi")(s.sound);
        if (soundReq) errors[`ling_six_sounds.${idx}.sound`] = soundReq;
        else {
          const setErr = inSet(["m", "u", "i", "a", "sh", "s"], "Sound tidak valid")(String(s.sound));
          if (setErr) errors[`ling_six_sounds.${idx}.sound`] = setErr;
        }

        const levelReq = required("Level wajib diisi")(s.level);
        if (levelReq) errors[`ling_six_sounds.${idx}.level`] = levelReq;
        else {
          const intErr = integer("Level harus angka bulat")(s.level);
          if (intErr) errors[`ling_six_sounds.${idx}.level`] = intErr;
          else {
            const bErr = betweenNumber(0, 4, "Level harus antara 0 dan 4")(Number(s.level));
            if (bErr) errors[`ling_six_sounds.${idx}.level`] = bErr;
          }
        }
      });
    }

    if (!Array.isArray(data.activities) || data.activities.length < 1) {
      errors["activities"] = "Minimal harus ada satu aktivitas.";
    } else {
      data.activities.forEach((a, idx) => {
        const nameErr = required("Activity name wajib diisi")(a.activity_name);
        if (nameErr) errors[`activities.${idx}.activity_name`] = nameErr;
        else {
          const nameMaxErr = stringTrimmedMax(255, "Maksimal 255 karakter")(a.activity_name);
          if (nameMaxErr) errors[`activities.${idx}.activity_name`] = nameMaxErr;
        }

        if (a.score !== null && a.score !== undefined && a.score !== "") {
          const scoreIntErr = integer("Score harus angka bulat")(a.score);
          if (scoreIntErr) errors[`activities.${idx}.score`] = scoreIntErr;
          else {
            const scoreBetweenErr = betweenNumber(0, 100, "Score harus antara 0 dan 100")(Number(a.score));
            if (scoreBetweenErr) errors[`activities.${idx}.score`] = scoreBetweenErr;
          }
        }
      });
    }

    (["listening", "speech", "language", "attention"] as const).forEach((key) => {
      const v = (data.evaluation as any)[key];
      const labelMap: Record<string, string> = {
        listening: "Listening",
        speech: "Speech",
        language: "Language",
        attention: "Attention",
      };
      const reqErr = required(`${labelMap[key]} wajib diisi`)(v);
      if (reqErr) errors[`evaluation.${key}`] = reqErr;
      else {
        const intErr = integer(`Nilai ${key} harus angka bulat`)(v);
        if (intErr) errors[`evaluation.${key}`] = intErr;
        else {
          const bErr = betweenNumber(1, 5, "Nilai harus antara 1 dan 5")(Number(v));
          if (bErr) errors[`evaluation.${key}`] = bErr;
        }
      }
    });

    if (!isPresent(data.evaluation.recommendation)) {
        errors["evaluation.recommendation"] = "Rekomendasi wajib diisi";
    }

    return errors;
  },
};
