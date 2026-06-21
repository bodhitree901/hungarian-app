import { useState, useRef, useEffect } from "react";
import { buildSystemPrompt } from "../utils/lessonContext";

const STARTERS = [
  "Szia! Milyen a napod?",
  "Van egy kérdésem...",
  "Mit csinálsz a hétvégéden?",
  "Mi az ebéded ma?",
  "Van kutyád vagy macskád?",
  "Honnan jöttek a szüleid?",
];

function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`chat-bubble-wrap ${isUser ? "chat-wrap-user" : "chat-wrap-assistant"}`}>
      {!isUser && <span className="chat-avatar">🇭🇺</span>}
      <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="chat-bubble-wrap chat-wrap-assistant">
      <span className="chat-avatar">🇭🇺</span>
      <div className="chat-bubble chat-bubble-assistant chat-bubble-typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

export default function ConversationMode({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt("chat"),
          messages: next,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.content[0].text }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="mode-wrapper">
      <div className="mode-header">
        <button className="back-icon-btn" onClick={onBack}>←</button>
        <span className="mode-header-title">🗣️ Chat with Sára</span>
        {messages.length > 0 && (
          <button className="chat-clear-btn" onClick={() => setMessages([])}>
            Reset
          </button>
        )}
      </div>

      <div className="chat-body">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="chat-welcome-avatar">🇭🇺</div>
            <p className="chat-welcome-text">
              Szia! I'm Sára. Let's chat in Hungarian using everything you've learned. Pick a starter or type your own!
            </p>
            <div className="chat-starters">
              {STARTERS.map((s) => (
                <button key={s} className="chat-starter-btn" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <form className="ask-form" onSubmit={handleSubmit}>
        <input
          className="ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Írj valamit... (write something)"
          disabled={loading}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button className="ask-send-btn" type="submit" disabled={!input.trim() || loading}>
          →
        </button>
      </form>
    </div>
  );
}
