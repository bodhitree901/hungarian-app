import { useState } from "react";
import { buildSystemPrompt } from "../utils/lessonContext";

const EXAMPLE_QUESTIONS = [
  "How does -hat/-het work? Give me 3 examples from what I know.",
  "What's the difference between nincs and nincsenek?",
  "List all the family words I've learned.",
  "Show me the full possessives table (én/te/ő/mi/ti/ők).",
  "When do I use -nak/-nek (dative)? Give examples.",
  "What are all the question words I've learned?",
  "How do I say what I have or don't have? (van/nincs pattern)",
  "Explain -ról/-ről with examples from my lessons.",
  "What verbs can I use with -hat/-het?",
  "Give me all the time words I know.",
  "How does -val/-vel (with) work?",
  "Make me a cheat sheet for the -kor suffix.",
  "Explain plural possessives — almám vs almáim.",
  "What's the difference between aki and akikkel?",
  "How do I ask 'what does someone have?' (mije van?)",
];

function RichText({ text }) {
  return (
    <div className="rich-text">
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((p, j) =>
          p.startsWith("**") ? <strong key={j}>{p.slice(2, -2)}</strong> : p
        );
        if (!line.trim()) return <br key={i} />;
        const isBullet = /^[-•]/.test(line.trim());
        return isBullet
          ? <li key={i} className="rich-li">{rendered}</li>
          : <p key={i} className="rich-p">{rendered}</p>;
      })}
    </div>
  );
}

export default function AskMode({ onBack }) {
  const [question, setQuestion] = useState("");
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function ask(q) {
    if (!q.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    setCurrentQ(q);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt("ask"),
          messages: [{ role: "user", content: q }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnswer(data.content[0].text);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(question);
    setQuestion("");
  }

  function reset() {
    setAnswer(null);
    setCurrentQ(null);
    setError(null);
    setQuestion("");
  }

  return (
    <div className="mode-wrapper">
      <div className="mode-header">
        <button className="back-icon-btn" onClick={onBack}>←</button>
        <span className="mode-header-title">💬 Ask about Hungarian</span>
      </div>

      <div className="mode-body">
        {!answer && !loading && !error && (
          <div className="ask-chips-section">
            <p className="ask-chips-label">Tap a question to get started:</p>
            <div className="ask-chips">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button key={q} className="ask-chip" onClick={() => ask(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="ask-loading">
            <div className="ask-spinner" />
            <p>Thinking...</p>
          </div>
        )}

        {error && (
          <div className="ask-error">
            <p>⚠️ {error}</p>
            <button className="ask-new-btn" onClick={reset}>Try again</button>
          </div>
        )}

        {answer && (
          <div className="ask-answer-wrap">
            <p className="ask-question-echo">"{currentQ}"</p>
            <div className="ask-answer-box">
              <RichText text={answer} />
            </div>
            <button className="ask-new-btn" onClick={reset}>
              Ask another question
            </button>
          </div>
        )}
      </div>

      <form className="ask-form" onSubmit={handleSubmit}>
        <input
          className="ask-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about what you've learned..."
          disabled={loading}
          autoComplete="off"
        />
        <button className="ask-send-btn" type="submit" disabled={!question.trim() || loading}>
          →
        </button>
      </form>
    </div>
  );
}
