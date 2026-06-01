import SpeakButton from "./SpeakButton";

export default function ImagePick({ exercise, onAnswer }) {
  return (
    <div className="exercise-body">
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="image-pick-emoji">{exercise.emoji}</div>
      <div className="options-grid">
        {exercise.options.map((opt) => (
          <button
            key={opt}
            className="option-btn image-option-btn"
            onClick={() => onAnswer(opt)}
          >
            <span>{opt}</span>
            <SpeakButton text={opt} size="sm" />
          </button>
        ))}
      </div>
    </div>
  );
}
