const TIER_LABELS = ["Recognise", "Recall", "Produce", "Converse", "Master"];

export default function HomeScreen({ lessons, progress, tiersCompleted, nextTier, isUnlocked, onSelect, onAsk, onChat }) {
  const totalTiers = lessons.length * 5;
  const doneTiers  = lessons.reduce((sum, l) => sum + tiersCompleted(l.id).length, 0);

  return (
    <div className="home-wrapper">
      <header className="home-header">
        <h1 className="app-title">🇭🇺 Magyar</h1>
        <p className="app-subtitle">Your personal Hungarian workbook</p>
        {doneTiers > 0 && (
          <p className="home-progress-summary">{doneTiers} / {totalTiers} tiers completed</p>
        )}
      </header>

      <div className="home-mode-buttons">
        <button className="home-mode-btn home-mode-ask" onClick={onAsk}>
          <span className="home-mode-icon">💬</span>
          <span className="home-mode-label">Ask</span>
          <span className="home-mode-sub">Questions about grammar</span>
        </button>
        <button className="home-mode-btn home-mode-chat" onClick={onChat}>
          <span className="home-mode-icon">🗣️</span>
          <span className="home-mode-label">Chat</span>
          <span className="home-mode-sub">Talk with Sára in Hungarian</span>
        </button>
      </div>

      <p className="home-section-label">Lessons</p>

      <div className="lesson-list">
        {lessons.map((lesson, idx) => {
          const locked     = !isUnlocked(lessons, idx);
          const done       = tiersCompleted(lesson.id);
          const next       = nextTier(lesson.id);
          const allDone    = done.length === 5;

          return (
            <button
              key={lesson.id}
              className={`lesson-card ${locked ? "lesson-locked" : ""} ${allDone ? "lesson-done" : ""}`}
              onClick={() => !locked && onSelect(lesson, next)}
              disabled={locked}
            >
              <div className="lesson-card-left">
                <span className="lesson-number">{idx + 1}</span>
                <div className="lesson-card-text">
                  <span className="lesson-card-title">{lesson.title}</span>
                  <span className="lesson-card-desc">{lesson.description}</span>
                  <TierDots completed={done} />
                </div>
              </div>
              <div className="lesson-card-right">
                {locked ? (
                  <span className="lesson-badge locked">🔒</span>
                ) : allDone ? (
                  <span className="lesson-badge done">✓ Done</span>
                ) : done.length === 0 ? (
                  <span className="lesson-badge start">Start →</span>
                ) : (
                  <span className="lesson-badge tier-next">
                    Tier {next}<br/>
                    <small>{TIER_LABELS[next - 1]}</small>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TierDots({ completed }) {
  return (
    <div className="tier-dots">
      {[1, 2, 3, 4, 5].map((t) => (
        <span
          key={t}
          className={`tier-dot ${completed.includes(t) ? "tier-dot--done" : ""}`}
          title={TIER_LABELS[t - 1]}
        />
      ))}
    </div>
  );
}
