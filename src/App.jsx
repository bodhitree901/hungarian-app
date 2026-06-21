import { useState } from "react";
import { lessons } from "./data/lessons";
import { useProgress } from "./hooks/useProgress";
import HomeScreen from "./components/HomeScreen";
import ExerciseEngine from "./components/ExerciseEngine";
import LessonComplete from "./components/LessonComplete";
import AskMode from "./components/AskMode";
import ConversationMode from "./components/ConversationMode";

export default function App() {
  const { progress, completeTier, resetProgress, tiersCompleted, nextTier, isUnlocked } = useProgress();
  const [view, setView]               = useState("home");
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTier, setActiveTier]   = useState(null);
  const [lastScore, setLastScore]     = useState(null);

  function startLesson(lesson, tier) {
    setActiveLesson(lesson);
    setActiveTier(tier);
    setView("lesson");
  }

  function handleComplete(score) {
    completeTier(activeLesson.id, activeTier, score);
    setLastScore(score);
    setView("complete");
  }

  function goHome() {
    setView("home");
    setActiveLesson(null);
    setActiveTier(null);
    setLastScore(null);
  }

  const tierData = activeLesson?.tiers?.find((t) => t.tier === activeTier);

  return (
    <div className="app-shell">
      {view === "home" && (
        <HomeScreen
          lessons={lessons}
          progress={progress}
          tiersCompleted={tiersCompleted}
          nextTier={nextTier}
          isUnlocked={isUnlocked}
          onSelect={startLesson}
          onAsk={() => setView("ask")}
          onChat={() => setView("chat")}
        />
      )}

      {view === "ask" && <AskMode onBack={goHome} />}
      {view === "chat" && <ConversationMode onBack={goHome} />}

      {view === "lesson" && activeLesson && tierData && (
        <>
          <div className="lesson-header">
            <button className="back-icon-btn" onClick={goHome}>←</button>
            <div className="lesson-header-text">
              <span className="lesson-header-title">{activeLesson.title}</span>
              <span className="lesson-header-tier">Tier {activeTier} — {tierData.label}</span>
            </div>
          </div>
          <ExerciseEngine
            key={`${activeLesson.id}-t${activeTier}`}
            exercises={tierData.exercises}
            onComplete={handleComplete}
          />
        </>
      )}

      {view === "complete" && activeLesson && (
        <LessonComplete
          lesson={activeLesson}
          tier={activeTier}
          score={lastScore}
          onBack={goHome}
          onNextTier={() => {
            const next = nextTier(activeLesson.id);
            const hasNext = next <= 5 && !progress[activeLesson.id]?.[next]?.completed;
            if (hasNext) startLesson(activeLesson, next);
            else goHome();
          }}
        />
      )}
    </div>
  );
}
