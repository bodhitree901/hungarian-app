import { useState } from "react";

const KEY = "hu_app_progress";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

// Shape: { [lessonId]: { [tier 1-5]: { completed: bool, score: {correct, total} } } }

export function useProgress() {
  const [progress, setProgress] = useState(load);

  function completeTier(lessonId, tier, score) {
    setProgress((prev) => {
      const next = {
        ...prev,
        [lessonId]: {
          ...(prev[lessonId] || {}),
          [tier]: { completed: true, score },
        },
      };
      save(next);
      return next;
    });
  }

  function resetProgress() {
    save({});
    setProgress({});
  }

  // How many tiers completed for a lesson
  function tiersCompleted(lessonId) {
    const lp = progress[lessonId] || {};
    return [1, 2, 3, 4, 5].filter((t) => lp[t]?.completed);
  }

  // Next tier to play (first incomplete, or 5 if all done)
  function nextTier(lessonId) {
    const done = tiersCompleted(lessonId);
    for (let t = 1; t <= 5; t++) {
      if (!done.includes(t)) return t;
    }
    return 5; // replay last tier if all done
  }

  // Lesson is unlocked if it's the first lesson, or the previous lesson has tier 1 done
  function isUnlocked() {
    return true;
  }

  return { progress, completeTier, resetProgress, tiersCompleted, nextTier, isUnlocked };
}
