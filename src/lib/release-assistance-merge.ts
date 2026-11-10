const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

/** Merge help seen on either device before the first submitted answer reaches the server. */
export function mergeReleasePracticeAssistance(chosen: Record<string, unknown>, local: Record<string, unknown>, remote: Record<string, unknown>) {
  if (record(remote.attempt)) return remote;
  const hintUsed = local.hintUsed === true || remote.hintUsed === true;
  return { ...chosen, hintUsed, attempt: record(chosen.attempt) ? { ...chosen.attempt, assisted: hintUsed } : chosen.attempt };
}
