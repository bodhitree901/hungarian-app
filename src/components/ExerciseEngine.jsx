import { useState } from "react";
import MultipleChoice from "./MultipleChoice";
import TypeAnswer from "./TypeAnswer";
import ImagePick from "./ImagePick";
import DialogueFill from "./DialogueFill";
import WordOrder from "./WordOrder";
import MatchPairs from "./MatchPairs";
import FeedbackPanel from "./FeedbackPanel";
import { checkAnswer } from "../utils/checkAnswer";

// Within a tier all exercises are shown in order, no difficulty filtering needed —
// the tier itself defines the difficulty level.
function pickNext(exercises, seenIds) {
  return exercises.find((e) => !seenIds.has(e.id)) ?? null;
}

export default function ExerciseEngine({ exercises, onComplete }) {
  const [seenIds, setSeenIds]   = useState(new Set());
  const [current, setCurrent]   = useState(() => exercises[0] ?? null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore]       = useState({ correct: 0, total: 0 });
  const [retryKey, setRetryKey] = useState(0);

  if (!current) { onComplete(score); return null; }

  const total    = exercises.length;
  const done     = seenIds.size;
  const progress = Math.round((done / total) * 100);

  function handleAnswer(userAnswer) {
    const { correct, accentOnly } = checkAnswer(current, userAnswer);
    setFeedback({ correct, accentOnly, answer: current.answer });
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  }

  function handleNext() {
    const newSeen = new Set(seenIds).add(current.id);
    setSeenIds(newSeen);
    setFeedback(null);
    const next = pickNext(exercises, newSeen);
    if (!next) { onComplete(score); return; }
    setCurrent(next);
  }

  function handleRetry() {
    setFeedback(null);
    setRetryKey((k) => k + 1);
  }

  function handleMatchDone() {
    const newScore = { correct: score.correct + 1, total: score.total + 1 };
    setScore(newScore);
    const newSeen = new Set(seenIds).add(current.id);
    setSeenIds(newSeen);
    setFeedback(null);
    const next = pickNext(exercises, newSeen);
    if (!next) { onComplete(newScore); return; }
    setCurrent(next);
  }

  const isMatchPairs = current.type === "match_pairs";

  return (
    <div className="engine-wrapper">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-label">{done} / {total} exercises</p>

      <div className="exercise-card">
        {!feedback && (
          <>
            {current.type === "multiple_choice" && <MultipleChoice exercise={current} onAnswer={handleAnswer} />}
            {current.type === "type_answer"     && <TypeAnswer     key={`${current.id}-${retryKey}`} exercise={current} onAnswer={handleAnswer} />}
            {current.type === "image_pick"      && <ImagePick      exercise={current} onAnswer={handleAnswer} />}
            {current.type === "dialogue"        && <DialogueFill   key={`${current.id}-${retryKey}`} exercise={current} onAnswer={handleAnswer} />}
            {current.type === "word_order"      && <WordOrder      key={`${current.id}-${retryKey}`} exercise={current} onAnswer={handleAnswer} />}
            {current.type === "match_pairs"     && <MatchPairs     exercise={current} onDone={handleMatchDone} />}
          </>
        )}

        {feedback && (
          <FeedbackPanel
            correct={feedback.correct}
            accentOnly={feedback.accentOnly}
            correctAnswer={feedback.answer}
            onNext={handleNext}
            onRetry={handleRetry}
          />
        )}
      </div>

      {!feedback && !isMatchPairs && (
        <div className="difficulty-controls">
          <button className="diff-btn too-hard" onClick={() => { handleRetry(); }}>😓 Too hard — retry</button>
        </div>
      )}
    </div>
  );
}
