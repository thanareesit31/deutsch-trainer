const key = "deutsch-trainer:test-workspace-last-page";

export function returnToLastLessonPage() {
  sessionStorage.setItem(key, window.location.pathname);
  window.location.reload();
}

export function isLastLessonPageRequested() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(key) === window.location.pathname;
}

export function clearLastLessonPageRequest() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
}
