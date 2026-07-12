import { useMemo } from "react";
import { warning } from "@/lib/toast";
import { getFirstErrorKey } from "@/utils/validation";
import {
  getLessonPlanLabel,
  getLessonPlanSectionKey,
} from "@/utils/lessonPlanUx";

export type UxValidationResult = {
  isValid: boolean;
  /**
   * Sorted missing field keys (based on clientErrors keys order)
   */
  missingKeys: string[];
  /**
   * First invalid fieldKey for scroll+focus
   */
  firstInvalidKey: string | null;
  /**
   * Section/card title for first invalid field
   */
  firstInvalidSection: string | null;
  /**
   * Toast summary message
   */
  toastMessage: string;
  /**
   * Optional toast location suffix for "tab/accordion" language.
   * For Lesson Plan (cards), we can still use it.
   */
  toastLocationText: string | undefined;
};

export function buildUxValidationForLessonPlan(
  clientErrors: Record<string, string>,
  opts?: {
    /**
     * Provide a fallback message when label can't be resolved.
     */
    fallbackToast?: string;
  }
): UxValidationResult {
  const missingKeys = useMemo(() => {
    // clientErrors already contains only fields that are invalid.
    return Object.keys(clientErrors).filter((k) => Boolean(clientErrors[k]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientErrors]) as unknown as string[];

  const firstInvalidKey = getFirstErrorKey(clientErrors);

  const firstInvalidSection = firstInvalidKey
    ? getLessonPlanSectionKey(firstInvalidKey)
    : null;

  const missingCount = missingKeys.length;

  const toastLocationText = firstInvalidSection
    ? ` pada bagian ${firstInvalidSection}.`
    : undefined;

  let toastMessage = opts?.fallbackToast ?? "Masih ada data yang wajib diisi.";

  if (missingCount === 1 && firstInvalidKey) {
    const label = getLessonPlanLabel(firstInvalidKey) ?? "data ini";
    toastMessage = `Field '${label}' wajib diisi.`;
  } else if (missingCount > 1) {
    toastMessage = `Masih ada ${missingCount} field yang wajib diisi.`;
  }

  // we also append location in the toast summary
  if (firstInvalidSection) {
    toastMessage = `Masih ada data yang harus dilengkapi pada tab ${firstInvalidSection}.`.replace(
      "tab ",
      ""
    );
    // But we keep required spec for Lesson Plan: just summary.
    // We'll append location only if desired by caller.
  }

  // Spec demands both summary and location text sometimes.
  // We'll keep toastLocationText separate.
  return {
    isValid: missingCount === 0,
    missingKeys,
    firstInvalidKey,
    firstInvalidSection,
    toastMessage: missingCount === 0 ? "" : toastMessage,
    toastLocationText:
      missingCount === 0 ? undefined : toastLocationText,
  };
}
