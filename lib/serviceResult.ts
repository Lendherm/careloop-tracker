// Services return a result instead of throwing, so route handlers and pages can
// decide how to show a failure.

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; fieldErrors?: Record<string, string> };

export function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function fail(
  status: number,
  error: string,
  fieldErrors?: Record<string, string>
): ServiceResult<never> {
  return { ok: false, status, error, fieldErrors };
}

export const CHECK_FORM = "Please check the form.";
