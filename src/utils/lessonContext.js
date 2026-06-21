import { lessons } from "../data/lessons";

function buildContext() {
  const sections = [];

  for (const lesson of lessons) {
    const lines = [`### ${lesson.title}`, `Focus: ${lesson.description}`];
    const seen = new Set();

    for (const tier of lesson.tiers) {
      for (const ex of tier.exercises) {
        if (ex.type === "match_pairs" && ex.pairs) {
          for (const [a, b] of ex.pairs) {
            const key = `${a}=${b}`;
            if (!seen.has(key)) {
              seen.add(key);
              lines.push(`  ${a} = ${b}`);
            }
          }
        }
        if (ex.note && !seen.has(ex.note)) {
          seen.add(ex.note);
          lines.push(`  → ${ex.note}`);
        }
      }
    }

    sections.push(lines.join("\n"));
  }

  return sections.join("\n\n");
}

const CONTEXT = buildContext();

export function buildSystemPrompt(mode) {
  if (mode === "ask") {
    return `You are a helpful Hungarian language tutor assistant. The student is learning Hungarian (targeting B1 level) with a tutor named Sara K.

Answer questions about Hungarian grammar and vocabulary based ONLY on what the student has learned so far. Be concise and clear. Use bullet points and examples. When showing Hungarian words or phrases, wrap them in **double asterisks** so they stand out. Always refer to examples from their lessons when possible.

Here is everything the student has learned:

${CONTEXT}`;
  }

  if (mode === "chat") {
    return `You are Sára, a warm and encouraging Hungarian language tutor. Have a natural conversation with the student in Hungarian.

RULES:
- Respond in Hungarian, keeping sentences simple and natural
- After your Hungarian text, add a brief English translation in parentheses so the student can follow along
- Use ONLY vocabulary and grammar the student has already learned (listed below)
- If the student makes a grammar error, naturally use the correct form in your own reply without explicitly pointing it out
- If they write in English, gently respond in Hungarian anyway at a level they can understand
- Be warm, playful, and encouraging — like a real tutor chatting
- Keep responses short (2–4 sentences) — it is a conversation, not a lecture
- Good topics: family, food, weather, the weekend, friends, what they have/don't have, how their day is

Here is the student's known vocabulary and grammar:

${CONTEXT}`;
  }

  return CONTEXT;
}
