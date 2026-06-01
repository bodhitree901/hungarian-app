import { useState } from "react";

export default function TypeAnswer({ exercise, onAnswer }) {
  const [value, setValue] = useState("");
  const [showHint, setShowHint] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onAnswer(value.trim());
  }

  return (
    <div className="exercise-body">
      <p className="exercise-prompt">{exercise.prompt}</p>
      {exercise.note && <p className="exercise-note">{exercise.note}</p>}
      <form onSubmit={handleSubmit} className="type-form">
        <input
          type="text"
          className="type-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your answer…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button type="submit" className="submit-btn" disabled={!value.trim()}>
          Check
        </button>
      </form>
      {exercise.hint && (
        <div className="hint-area">
          {showHint ? (
            <p className="hint-text">💡 {exercise.hint}</p>
          ) : (
            <button className="hint-btn" onClick={() => setShowHint(true)}>
              Show hint
            </button>
          )}
        </div>
      )}
    </div>
  );
}
