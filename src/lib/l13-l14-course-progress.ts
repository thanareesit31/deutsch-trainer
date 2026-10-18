import {
  courseCategories,
  allCourseExercisePatterns,
  type CourseAttempt,
  type CourseCategory,
  type CourseLessonId,
  type CourseProgressState,
} from "./l13-l14-course";

export type ParsedCourseProgress =
  | { kind: "empty"; state: CourseProgressState }
  | { kind: "valid"; state: CourseProgressState }
  | { kind: "invalid"; raw: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");
const isCourseCategory = (value: unknown): value is CourseCategory =>
  courseCategories.some((category) => category.id === value);
const isCourseLesson = (value: unknown): value is CourseLessonId =>
  value === "L13" || value === "L14";
const isStringRecord = (value: unknown): value is Record<string, string> =>
  isRecord(value) && Object.values(value).every((entry) => typeof entry === "string");
const isResponse = (
  value: unknown,
): value is CourseAttempt["response"] =>
  value === null ||
  typeof value === "string" ||
  isStringArray(value) ||
  isStringRecord(value);
const isTime = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value));
const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

function isCourseAttempt(value: unknown): value is CourseAttempt {
  if (!isRecord(value)) return false;
  return (
    typeof value.attemptId === "string" &&
    typeof value.exerciseId === "string" &&
    typeof value.questionId === "string" &&
    isCourseLesson(value.lessonId) &&
    isCourseCategory(value.category) &&
    isStringArray(value.topicIds) &&
    typeof value.primaryCompetency === "string" &&
    allCourseExercisePatterns.some((pattern) => pattern.id === value.patternId) &&
    isResponse(value.response) &&
    isTime(value.startedAt) &&
    isTime(value.submittedAt) &&
    (value.correctness === null ||
      (typeof value.correctness === "number" &&
        value.correctness >= 0 &&
        value.correctness <= 1)) &&
    typeof value.maxScore === "number" &&
    value.maxScore >= 0 &&
    (value.errorTag === undefined || typeof value.errorTag === "string") &&
    isNonNegativeInteger(value.hintsUsed) &&
    isNonNegativeInteger(value.retryNumber) &&
    ["deterministic", "rubric", "manual", "asr_assisted"].includes(
      String(value.evaluationMethod),
    ) &&
    typeof value.answerVersion === "string"
  );
}

function isCourseProgressState(value: unknown): value is CourseProgressState {
  return (
    isRecord(value) &&
    value.version === 1 &&
    isStringArray(value.completedTopics) &&
    Array.isArray(value.attempts) &&
    value.attempts.every(isCourseAttempt) &&
    isStringRecord(value.drafts)
  );
}

export function parseCourseProgress(serialized: string | null): ParsedCourseProgress {
  if (serialized === null)
    return { kind: "empty", state: { version: 1, completedTopics: [], attempts: [], drafts: {} } };
  try {
    const value: unknown = JSON.parse(serialized);
    if (!isCourseProgressState(value)) return { kind: "invalid", raw: serialized };
    return { kind: "valid", state: value };
  } catch {
    return { kind: "invalid", raw: serialized };
  }
}

export function completeCourseTopic(
  state: CourseProgressState,
  topicId: string,
): CourseProgressState {
  return state.completedTopics.includes(topicId)
    ? state
    : { ...state, completedTopics: [...state.completedTopics, topicId] };
}

export function saveCourseDraft(
  state: CourseProgressState,
  topicId: string,
  value: string,
): CourseProgressState {
  return { ...state, drafts: { ...state.drafts, [topicId]: value } };
}

export function recordCourseAttempt(
  state: CourseProgressState,
  attempt: CourseAttempt,
): CourseProgressState {
  return { ...state, attempts: [...state.attempts, attempt] };
}

export function summarizeCourseProgress(state: CourseProgressState) {
  const independent = state.attempts.filter(
    (attempt) => attempt.correctness !== null && attempt.hintsUsed === 0 && attempt.evaluationMethod === "deterministic",
  );
  const correct = independent.filter((attempt) => attempt.correctness === 1);
  const sessions = new Set(independent.map((attempt) => {
    return new Date(attempt.submittedAt).toISOString().slice(0, 10);
  }));
  const patterns = new Set(independent.map((attempt) => attempt.patternId));
  const first = independent.length ? Math.min(...independent.map((attempt) => Date.parse(attempt.submittedAt))) : null;
  const last = independent.length ? Math.max(...independent.map((attempt) => Date.parse(attempt.submittedAt))) : null;
  const retentionCheck = first !== null && last !== null && last - first >= 24 * 60 * 60 * 1000;
  return {
    attempts: state.attempts.length,
    independentAttempts: independent.length,
    correctWithoutHints: correct.length,
    accuracy: independent.length ? correct.length / independent.length : null,
    uniquePatterns: patterns.size,
    sessions: sessions.size,
    retentionCheck,
    stable: independent.length >= 8 && patterns.size >= 3 && sessions.size >= 2 && retentionCheck,
  };
}
