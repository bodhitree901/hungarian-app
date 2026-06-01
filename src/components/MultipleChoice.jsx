export default function MultipleChoice({ exercise, onAnswer }) {
  return (
    <div className="exercise-body">
      <p className="exercise-prompt">{exercise.prompt}</p>
      {exercise.note && <p className="exercise-note">{exercise.note}</p>}
      <div className="options-grid">
        {exercise.options.map((opt) => (
          <button
            key={opt}
            className="option-btn"
            onClick={() => onAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
