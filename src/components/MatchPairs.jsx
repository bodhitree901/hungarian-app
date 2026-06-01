import { useState, useMemo } from "react";
import { speak } from "../utils/speech";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairs({ exercise, onDone }) {
  const leftItems  = useMemo(() => shuffle(exercise.pairs.map((p, i) => ({ text: p[0], pairIdx: i }))), []);
  const rightItems = useMemo(() => shuffle(exercise.pairs.map((p, i) => ({ text: p[1], pairIdx: i }))), []);

  const [selectedLeft, setSelectedLeft]   = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched]             = useState(new Set()); // pairIdx values
  const [wrongFlash, setWrongFlash]       = useState(null);      // pairIdx or "wrong"

  const allDone = matched.size === exercise.pairs.length;

  function handleLeft(item) {
    if (matched.has(item.pairIdx)) return;
    setSelectedLeft(item);
    setSelectedRight(null);
  }

  function handleRight(item) {
    if (matched.has(item.pairIdx)) return;
    if (!selectedLeft) { setSelectedRight(item); return; }

    if (selectedLeft.pairIdx === item.pairIdx) {
      // Correct match
      speak(exercise.pairs[item.pairIdx][0]);
      setMatched((m) => new Set([...m, item.pairIdx]));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      // Wrong — flash and clear
      setWrongFlash(item.pairIdx);
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  }

  function itemClass(item, side) {
    const isMatched  = matched.has(item.pairIdx);
    const isSelected = side === "left"
      ? selectedLeft?.pairIdx === item.pairIdx
      : selectedRight?.pairIdx === item.pairIdx;
    const isWrong    = wrongFlash === item.pairIdx;
    return [
      "match-item",
      isMatched  ? "match-item--done"     : "",
      isSelected ? "match-item--selected" : "",
      isWrong    ? "match-item--wrong"    : "",
    ].join(" ").trim();
  }

  return (
    <div className="exercise-body">
      <p className="exercise-prompt">{exercise.prompt ?? "Match each word to its meaning."}</p>

      <div className="match-grid">
        <div className="match-col">
          {leftItems.map((item) => (
            <button key={item.pairIdx} className={itemClass(item, "left")} onClick={() => handleLeft(item)}>
              {item.text}
            </button>
          ))}
        </div>
        <div className="match-col">
          {rightItems.map((item) => (
            <button key={item.pairIdx} className={itemClass(item, "right")} onClick={() => handleRight(item)}>
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {allDone && (
        <div className="match-complete">
          <p>All matched! 🎉</p>
          <button className="next-btn" onClick={onDone}>Next →</button>
        </div>
      )}
    </div>
  );
}
