import { useEffect, useMemo, useRef, useState } from "react";
import type { Schema } from "@/validators/lessonPlan";
import {
  focusFirstErrorField,
  getFirstErrorKey,
  normalizeServerErrors,
} from "@/utils/validation";
import type { FieldErrors } from "@/utils/validation";

export type UseFormValidationOptions<TData> = {
  /**
   * Schema validasi frontend.
   * Harus return map fieldKey -> message (string).
   */
  schema: { validate: (data: TData) => Record<string, string | undefined> };

  /**
   * Errors dari backend (Inertia).
   * bentuk: { fieldKey: ["message"] }
   */
  serverErrors?: unknown;

  /**
   * Bila true, validate onChange/onBlur (realtime).
   * Default: true
   */
  realtime?: boolean;

  /**
   * Map of input fieldKey -> current value (optional)
   * Jika tidak diberikan, hook akan validate penuh pada submit saja.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export type UseFormValidationResult<TData> = {
  clientErrors: Record<string, string>;
  /**
   * Tambahkan server errors (mapping Laravel validation) ke state errors.
   * Jika field sudah valid di frontend, sebaiknya error hilang setelah input diperbaiki.
   */
  applyServerErrors: () => void;

  /**
   * validate full data (submit)
   */
  validateAll: () => boolean;

  /**
   * validate satu field (realtime)
   */
  validateField: (fieldKey: string, value: unknown) => string | undefined;

  /**
   * call saat input berubah (agar realtime menghapus error yang sudah valid)
   */
  onChangeValidate: (fieldKey: string, value: unknown) => void;

  /**
   * call saat blur untuk realtime
   */
  onBlurValidate: (fieldKey: string, value: unknown) => void;
};

function isRecordOfStrings(
  v: unknown
): v is Record<string, string> | Record<string, string | undefined> {
  return v !== null && typeof v === "object";
}

export function useFormValidation<TData>(
  data: TData,
  opts: UseFormValidationOptions<TData>
): UseFormValidationResult<TData> {
  const { schema, serverErrors, realtime = true } = opts;

  const normalizedServerErrors = useMemo(() => {
    return normalizeServerErrors(serverErrors);
  }, [serverErrors]);

  const [clientErrors, setClientErrors] = useState<Record<string, string>>(
    {}
  );

  const didApplyServer = useRef(false);

  const applyServerErrors = () => {
    const mapped = normalizedServerErrors;

    setClientErrors((prev) => {
      // merge: server errors overwrite only if no client error for that key
      const next: Record<string, string> = { ...prev };
      for (const [k, v] of Object.entries(mapped)) {
        if (!next[k]) next[k] = v;
      }
      return next;
    });

    didApplyServer.current = true;
  };

  const validateAll = () => {
    const errs = schema.validate(data);

    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(errs)) {
      if (v) next[k] = v;
    }

    setClientErrors(next);

    const firstKey = getFirstErrorKey(next);
    focusFirstErrorField(firstKey);

    return Object.keys(next).length === 0;
  };

  const validateField = (fieldKey: string, value: unknown) => {
    // Validate minimal: run full schema and pick the fieldKey,
    // since schema validator is already the single source of truth.
    // (Performance acceptable for current forms; later can optimize.)
    const fullErrs = schema.validate(data);
    const nextMsg = fullErrs[fieldKey];

    setClientErrors((prev) => {
      const copy = { ...prev };
      if (nextMsg) copy[fieldKey] = nextMsg;
      else delete copy[fieldKey];
      return copy;
    });

    return nextMsg;
  };

  const onChangeValidate = (fieldKey: string, value: unknown) => {
    if (!realtime) return;
    validateField(fieldKey, value);
  };

  const onBlurValidate = (fieldKey: string, value: unknown) => {
    if (!realtime) return;
    validateField(fieldKey, value);
  };

  useEffect(() => {
    if (serverErrors && !didApplyServer.current) {
      applyServerErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverErrors]);

  return {
    clientErrors,
    applyServerErrors,
    validateAll,
    validateField,
    onChangeValidate,
    onBlurValidate,
  };
}
