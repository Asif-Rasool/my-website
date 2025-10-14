export default function ChatWithRazor() {
  return (
    <div className="chat-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Chat with rAI-zor</h2>
            <p>
              Connect your preferred LLM or agent stack when you are ready. The layout inherits the AsifRasool.net styling
              and keeps the experience consistent across the site.
            </p>
          </div>
        </div>
        <div className="highlight-panel">
          <div className="chat-shell">
            <div className="chat-shell__messages">
              <div className="chat-message chat-message--assistant">
                Welcome! Drop your prompt here once the back end is connected. Use this space to share how the assistant
                thinks, the guardrails it follows, and what it can help visitors accomplish.
              </div>
              <div className="chat-message chat-message--user">Message bubbles are styled and ready.</div>
            </div>
            <form className="chat-shell__composer" onSubmit={(event) => event.preventDefault()}>
              <input type="text" placeholder="Type your message" disabled />
              <button type="submit" disabled>
                Send
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Integration checklist</h2>
          <p>
            Track the steps needed to activate the experience. Replace the placeholders as you connect the workflow and
            finalize your conversation design.
          </p>
        </div>
        <div className="card-grid">
          {["Choose model & provider", "Secure API keys", "Define starter prompts"].map((item) => (
            <article key={item} className="elevated-card">
              <h3>{item}</h3>
              <p>
                Document requirements, environment variables, and guardrails for the conversational layer. Keep the playbook
                close to the UI for quick iteration.
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
