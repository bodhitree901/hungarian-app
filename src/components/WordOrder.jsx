import { useState, useMemo } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordOrder({ exercise, onAnswer }) {
  const shuffled = useMemo(() => shuffle(exercise.words), [exercise.words]);
  const [built, setBuilt] = useState([]);       // { word, uid }
  const [available, setAvailable] = useState(
    () => shuffled.map((w, i) => ({ word: w, uid: i }))
  );

  function addWord(item) {
    setAvailable((a) => a.filter((x) => x.uid !== item.uid));
    setBuilt((b) => [...b, item]);
  }

  function removeWord(item) {
    setBuilt((b) => b.filter((x) => x.uid !== item.uid));
    setAvailable((a) => [...a, item]);
  }

  function handleCheck() {
    onAnswer(built.map((x) => x.word).join(" "));
  }

  return (
    <div className="exercise-body">
      <p className="exercise-prompt">{exercise.prompt}</p>

      {/* Sentence being built */}
      <div className="word-order-built" onClick={(e) => e.stopPropagation()}>
        {built.length === 0
          ? <span className="word-order-placeholder">Tap words below to build the sentence…</span>
          : built.map((item) => (
              <button key={item.uid} className="word-tile word-tile--placed" onClick={() => removeWord(item)}>
                {item.word}
              </button>
            ))
        }
      </div>

      {/* Available word tiles */}
      <div className="word-order-available">
        {available.map((item) => (
          <button key={item.uid} className="word-tile word-tile--available" onClick={() => addWord(item)}>
            {item.word}
          </button>
        ))}
      </div>

      <button
        className="submit-btn"
        disabled={built.length === 0}
        onClick={handleCheck}
      >
        Check
      </button>
    </div>
  );
}
