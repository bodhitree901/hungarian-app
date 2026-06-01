const TIER_LABELS = ["Recognise", "Recall", "Produce", "Converse", "Master"];

export default function LessonComplete({ lesson, tier, score, onBack, onNextTier }) {
  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const isLastTier = tier === 5;

  return (
    <div className="complete-screen">
      <div className="complete-card">
        <div className="complete-icon">
          {isLastTier && pct >= 70 ? "🏆" : pct >= 70 ? "⭐" : "📖"}
        </div>
        <h2 className="complete-title">Tier {tier} complete!</h2>
        <p className="complete-lesson-name">{lesson.title}</p>
        <p className="complete-tier-label">{TIER_LABELS[tier - 1]}</p>

        <div className="complete-score">
          <span className="score-big">{pct}%</span>
          <span className="score-sub">{score.correct} / {score.total} correct</span>
        </div>

        <div className="tier-dots tier-dots--large">
          {[1,2,3,4,5].map((t) => (
            <span key={t} className={`tier-dot ${t <= tier ? "tier-dot--done" : ""}`} />
          ))}
        </div>

        <p className="complete-message">
          {pct === 100 ? "Perfect!" : pct >= 70 ? "Great work!" : "Good effort — try again anytime."}
        </p>

        <div className="complete-actions">
          {!isLastTier && pct >= 50 && (
            <button className="next-tier-btn" onClick={onNextTier}>
              Tier {tier + 1}: {TIER_LABELS[tier]} →
            </button>
          )}
          <button className="back-btn" onClick={onBack}>← Back to lessons</button>
        </div>
      </div>
    </div>
  );
}
