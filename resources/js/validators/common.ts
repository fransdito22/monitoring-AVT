import { isEmptyString, normalizeTrimmedString, isInSet } from "@/utils/validation";

export type ValidatorContext<TData> = {
  data: TData;
};

export type ValidatorFn<TData> = (
  value: any,
  ctx?: ValidatorContext<TData>
) => string | undefined;

export function required<TData>(message = "Wajib diisi") {
  return (((value: any) => {
    if (value === null || value === undefined) return message;
    if (typeof value === "string") return isEmptyString(value) ? message : undefined;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function requiredTrimmed<TData>(message = "Wajib diisi") {
  return (((value: any) => {
    if (value === null || value === undefined) return message;
    if (typeof value === "string") return isEmptyString(value) ? message : undefined;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function requiredNumber<TData>(
  message = "Wajib diisi"
) {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return message;
    if (typeof value === "number" && !Number.isNaN(value)) return undefined;
    return message;
  }) as unknown) as ValidatorFn<TData>;
}

export function integer<TData>(message = "Harus berupa angka bulat") {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return undefined;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return message;
    if (!Number.isInteger(n)) return message;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function minNumber<TData>(min: number, message?: string) {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return undefined;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return message ?? `Minimal ${min}`;
    if (n < min) return message ?? `Minimal ${min}`;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function maxNumber<TData>(max: number, message?: string) {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return undefined;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return message ?? `Maksimal ${max}`;
    if (n > max) return message ?? `Maksimal ${max}`;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function betweenNumber<TData>(min: number, max: number, message?: string) {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return undefined;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return message ?? `Harus antara ${min} dan ${max}`;
    if (n < min || n > max) return message ?? `Harus antara ${min} dan ${max}`;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function stringTrimmedMax<TData>(max: number, message?: string) {
  return (((value: any) => {
    if (value === null || value === undefined) return undefined;
    if (typeof value !== "string") return message ?? `Maksimal ${max} karakter`;
    const trimmed = normalizeTrimmedString(value);
    if (trimmed.length > max) return message ?? `Maksimal ${max} karakter`;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function stringType<TData>(message = "Harus berupa teks") {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return undefined;
    if (typeof value !== "string") return message;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function dateRequired<TData>(message = "Tanggal wajib diisi") {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return message;
    if (typeof value !== "string") return message;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return message;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function timeFormatHhMm<TData>(message = "Format jam tidak valid") {
  // Backend: date_format:H:i
  // Accepts "HH:mm"
  const re = /^([01]\d|2[0-3]):[0-5]\d$/;
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return undefined;
    if (typeof value !== "string") return message;
    if (!re.test(value)) return message;
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function inSet<TData>(allowed: readonly string[], message?: string) {
  return (((value: any) => {
    if (value === null || value === undefined || value === "") return undefined;
    const s = String(value);
    if (!isInSet(s, allowed)) return message ?? "Nilai tidak valid";
    return undefined;
  }) as unknown) as ValidatorFn<TData>;
}

export function nullable<TData>() {
  return ((_: any) => undefined) as unknown as ValidatorFn<TData>;
}
