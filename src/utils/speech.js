function getBestHungarianVoice() {
  const voices = window.speechSynthesis.getVoices();
  const hu = voices.filter(v => v.lang.startsWith("hu"));
  if (!hu.length) return null;
  // Prefer voices with "Google" or "Neural" or "Natural" in the name (higher quality)
  const preferred = hu.find(v => /google|neural|natural|premium|enhanced/i.test(v.name));
  return preferred || hu[0];
}

export function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hu-HU";
  u.rate = 0.82;
  u.pitch = 1;
  const voice = getBestHungarianVoice();
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

export function cancelSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
