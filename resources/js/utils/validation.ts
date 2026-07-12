export type FieldErrors = Record<string, string | undefined>;

/**
 * Normalizes Laravel/Inertia error payload keys into a form-field key map.
 * Supports dot-paths (e.g. "details.0.target_word") by returning them as-is.
 */
export function normalizeServerErrors(
  serverErrors: unknown
): Record<string, string> {
  if (!serverErrors || typeof serverErrors !== "object") return {};

  const out: Record<string, string> = {};
  const errs = serverErrors as Record<string, unknown>;

  for (const [key, value] of Object.entries(errs)) {
    if (typeof value === "string") {
      out[key] = value;
      continue;
    }

    if (Array.isArray(value) && value.length > 0) {
      const first = value[0];
      if (typeof first === "string") out[key] = first;
    }
  }

  return out;
}

/**
 * Extracts first error key in a stable order.
 */
export function getFirstErrorKey(errors: Record<string, string | undefined>) {
  return Object.keys(errors).find((k) => Boolean(errors[k])) ?? null;
}

/**
 * Attempts to focus+scroll the first invalid field.
 *
 * Convention:
 * - inputs should have `data-field="<fieldKey>"` attribute OR `id="<fieldKey>"`.
 */
export function focusFirstErrorField(
  fieldKey: string | null
): void {
  if (!fieldKey) return;

  const el =
    document.querySelector<HTMLElement>(`[data-field="${cssEscape(fieldKey)}"]`) ||
    document.getElementById(fieldKey);

  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // Attempt focus; for non-focusable elements, focus may throw.
  try {
    (el as any).focus?.();
  } catch {
    // ignore
  }
}

/**
 * Minimal CSS escape helper for querySelector attribute selectors.
 * This avoids bringing extra dependencies.
 */
function cssEscape(value: string) {
  // Use a conservative escape for quotes/backslashes.
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function isEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length === 0;
}

/**
 * Ensures string trimming rules without changing original input state.
 */
export function normalizeTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Convenience: set of allowed string values.
 */
export function isInSet(value: unknown, allowed: readonly string[]) {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}
