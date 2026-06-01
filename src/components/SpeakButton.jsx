import { speak } from "../utils/speech";

export default function SpeakButton({ text, size = "md" }) {
  return (
    <button
      className={`speak-btn speak-btn--${size}`}
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      title="Hear pronunciation"
      aria-label="Hear pronunciation"
    >
      🔊
    </button>
  );
}
