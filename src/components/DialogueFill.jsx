import { useState } from "react";
import SpeakButton from "./SpeakButton";

// Lines with ___ get an input/options. Lines without are read-only context.
export default function DialogueFill({ exercise, onAnswer }) {
  const [typed, setTyped] = useState("");
  const [showHint, setShowHint] = useState(false);

  const isMe = (speaker) => speaker === "Te" || speaker === "You";

  function handleSubmit(e) {
    e.preventDefault();
    if (typed.trim()) onAnswer(typed.trim());
  }

  return (
    <div className="exercise-body">
      <p className="exercise-prompt">{exercise.prompt ?? "Fill in the missing word."}</p>

      <div className="dialogue-lines">
        {exercise.lines.map((line, i) => {
          const hasBlank = line.text.includes("___");
          const isMeSide = isMe(line.speaker);

          if (!hasBlank) {
            return (
              <div key={i} className={`dialogue-bubble ${isMeSide ? "bubble-me" : "bubble-them"}`}>
                <span className="bubble-speaker">{line.speaker}</span>
                <div className="bubble-body">
                  <span className="bubble-text">{line.text}</span>
                  <SpeakButton text={line.text} size="sm" />
                </div>
              </div>
            );
          }

          const [before, after] = line.text.split("___");

          return (
            <div key={i} className={`dialogue-bubble ${isMeSide ? "bubble-me" : "bubble-them"}`}>
              <span className="bubble-speaker">{line.speaker}</span>
              <div className="bubble-body">
                {exercise.options ? (
                  // Multiple choice blank
                  <div className="dialogue-mc">
                    <span className="bubble-text">{before}</span>
                    <div className="dialogue-options">
                      {exercise.options.map((opt) => (
                        <button
                          key={opt}
                          className="dialogue-opt-btn"
                          onClick={() => onAnswer(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <span className="bubble-text">{after}</span>
                  </div>
                ) : (
                  // Type-in blank
                  <form onSubmit={handleSubmit} className="dialogue-type-form">
                    <span className="bubble-text">{before}</span>
                    <input
                      className="dialogue-input"
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      placeholder="___"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <span className="bubble-text">{after}</span>
                    <button type="submit" className="submit-btn dialogue-submit" disabled={!typed.trim()}>
                      Check
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {exercise.hint && (
        <div className="hint-area">
          {showHint
            ? <p className="hint-text">💡 {exercise.hint}</p>
            : <button className="hint-btn" onClick={() => setShowHint(true)}>Show hint</button>
          }
        </div>
      )}
    </div>
  );
}
