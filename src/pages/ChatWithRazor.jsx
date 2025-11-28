import { useEffect, useRef, useState } from "react";
import { defaultWelcome, knowledgeBase } from "../data/raizorKnowledge";

const SYSTEM_PROMPT = `You are rAIzor, a friendly cat-inspired guide for Asif Rasool's site.
You only answer using the provided context drawn from Asif's resume, CV, and site files.
If the context does not contain the answer, say you don't know yet.
When the user only greets (hi/hello/hey), reply briefly and ask what they want to know about Asif (work, research, projects, education), instead of volunteering a biography.
If a question is vague, ask a focused follow-up. Keep answers concise, direct, and helpful.`;

function scoreEntry(entry, query) {
  const terms = query.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);
  if (!terms.length) return 0;

  const text = `${entry.title} ${entry.content}`.toLowerCase();
  const base = Math.min(entry.content.length / 200, 4);
  const overlap = terms.reduce((score, term) => (text.includes(term) ? score + 2 : score), 0);
  const exactCategory = /project|education|experience|publication/.test(query.toLowerCase()) && entry.category ? 1 : 0;

  return base + overlap + exactCategory;
}

function buildContext(query, limit = 6) {
  const ranked = [...knowledgeBase]
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, query),
    }))
    .sort((a, b) => b.score - a.score);

  const top = ranked.slice(0, limit).map(({ entry }) => entry);
  const block = top.map((item) => `${item.title} [${item.source}]: ${item.content}`).join("\n\n");

  return { block, top };
}

function isGreeting(text) {
  const normalized = text.trim().toLowerCase();
  const greetings = ["hi", "hello", "hey", "yo", "sup", "hiya", "good morning", "good afternoon", "good evening"];
  return greetings.some((greet) => normalized === greet || normalized === `${greet}!`);
}

function buildLocalFallback(question) {
  const { top } = buildContext(question, 5);
  if (!top.length) {
    return "I could not reach Gemini and I do not have local info for this yet. Please try again later.";
  }
  const summary = top.map((item) => `- ${item.title}: ${item.content}`).join("\n");
  return `I could not reach Gemini (network or API key issue). Here is what I can share from the on-page sources:\n${summary}`;
}

const suggestedQuestions = [
  "What is Asif working on right now?",
  "Tell me about SmartField LA.",
  "What is the ThunderHorse Energy Forecasting model?",
  "What is LionIDE?",
  "Summarize Asif's education background.",
  "What did he do as Senior Economist in New Mexico?",
  "What are key highlights from his dissertation?",
  "How can I contact Asif?",
];

async function callChatApi({ userText, history, contextBlock }) {
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userText,
      history,
      contextBlock,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Chat endpoint failed (${response.status}): ${errorBody}`);
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error("Chat endpoint returned invalid JSON.");
  }

  if (result?.error) {
    throw new Error(result.error);
  }

  const output = typeof result?.reply === "string" ? result.reply.trim() : "";

  if (!output) {
    throw new Error("Chat endpoint did not return a reply.");
  }

  return output;
}

export default function ChatWithRazor() {
  const [messages, setMessages] = useState([{ role: "assistant", content: defaultWelcome }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendQuestion = async (question) => {
    if (!question.trim() || isLoading) return;

    if (isGreeting(question)) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "Hi! I'm rAIzor. What would you like to know about Asif's work, research, projects, or education?" },
      ]);
      return;
    }

    const { block, top } = buildContext(question);
    const updatedHistory = [...messages, { role: "user", content: question }];

    setError("");
    setIsLoading(true);
    setMessages(updatedHistory);

    try {
      const reply = await callChatApi({
        userText: question,
        history: updatedHistory.slice(-6),
        contextBlock: block,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: reply, sources: top.map((item) => item.title) }]);
    } catch (err) {
      const friendly = err instanceof Error ? err.message : "Something went wrong calling the model.";
      setError(friendly);
      const fallback = buildLocalFallback(question);
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = input.trim();
    setInput("");
    await sendQuestion(question);
  };

  const handleSuggested = async (question) => {
    await sendQuestion(question);
  };

  return (
    <div className="chat-view chat-view--simple">
      <section className="page-section">
        <h2 className="chat-title">Chat with rAIzor</h2>

        <div className="highlight-panel chat-panel">
          <div className="chip-row chip-row--centered">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                type="button"
                className="question-chip"
                onClick={() => handleSuggested(question)}
                disabled={isLoading}
                aria-label={`Ask: ${question}`}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="chat-shell__messages chat-shell__messages--simple" ref={messagesRef}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${message.role === "assistant" ? "chat-message--assistant" : "chat-message--user"}`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && <div className="chat-message chat-message--assistant muted">rAIzor is thinking...</div>}
          </div>

          <form className="chat-shell__composer" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask about Asif's work, research, or education"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
          <p className="chat-warning">
            Note: This chatbot is built by Asif. Avoid sharing personal or sensitive information - inputs can be visible to him and to the
            model provider.
          </p>
          {error && <div className="inline-alert">{error}</div>}
        </div>
      </section>
    </div>
  );
}
