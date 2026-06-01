function stripAccents(str) {
  return str
    .replace(/[áÁ]/g, "a")
    .replace(/[éÉ]/g, "e")
    .replace(/[íÍ]/g, "i")
    .replace(/[óÓ]/g, "o")
    .replace(/[öÖ]/g, "o")
    .replace(/[őŐ]/g, "o")
    .replace(/[úÚ]/g, "u")
    .replace(/[üÜ]/g, "u")
    .replace(/[űŰ]/g, "u");
}

function clean(str) {
  return str.toLowerCase().trim().replace(/[!?.]/g, "");
}

// Returns { correct: bool, accentOnly: bool }
// accentOnly = true means the answer was right ignoring accents, so we accept
// it but warn the user to use the correct characters.
export function checkAnswer(exercise, userAnswer) {
  const userClean = clean(userAnswer);
  const candidates = [exercise.answer, ...(exercise.acceptableAnswers || [])];

  // Exact match (after cleaning punctuation/case)
  if (candidates.some((a) => clean(a) === userClean)) {
    return { correct: true, accentOnly: false };
  }

  // Accent-insensitive match
  const userStripped = stripAccents(userClean);
  if (candidates.some((a) => stripAccents(clean(a)) === userStripped)) {
    return { correct: true, accentOnly: true };
  }

  return { correct: false, accentOnly: false };
}
