import { useEffect } from "react";
import { speak } from "../utils/speech";
import SpeakButton from "./SpeakButton";

export default function FeedbackPanel({ correct, accentOnly, correctAnswer, onNext, onRetry }) {
  // Auto-speak the correct answer so they always hear it
  useEffect(() => {
    speak(correctAnswer);
  }, [correctAnswer]);

  if (accentOnly) {
    return (
      <div className="feedback-panel feedback-accent">
        <div className="feedback-top">
          <p className="feedback-title">Correct! ✓</p>
          <SpeakButton text={correctAnswer} />
        </div>
        <p className="feedback-accent-note">
          Watch the accents: <strong>{correctAnswer}</strong>
        </p>
        <div className="feedback-actions">
          <button className="next-btn" onClick={onNext}>Next →</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`feedback-panel ${correct ? "feedback-correct" : "feedback-wrong"}`}>
      <div className="feedback-top">
        <p className="feedback-title">{correct ? "Correct! 🎉" : "Not quite."}</p>
        <SpeakButton text={correctAnswer} />
      </div>
      {!correct && (
        <p className="feedback-answer">Answer: <strong>{correctAnswer}</strong></p>
      )}
      <div className="feedback-actions">
        {!correct && (
          <button className="retry-btn" onClick={onRetry}>↩ Try again</button>
        )}
        <button className="next-btn" onClick={onNext}>
          {correct ? "Next →" : "Skip →"}
        </button>
      </div>
    </div>
  );
}
