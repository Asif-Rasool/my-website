export default function Contact() {
  return (
    <div className="contact-view">
      <section className="page-section">
        <div className="section-heading section-heading--center">
          <div>
            <h2>Contact</h2>
            <p>Reach Asif directly at <a href="mailto:asif.rasool@selu.edu">asif.rasool@selu.edu</a> for collaborations or questions.</p>
          </div>
        </div>

        <div className="contact-copy">
          <p>
            I welcome opportunities to collaborate with businesses, government agencies, and community partners. My work spans applied
            economic research, data science, AI, and product development. If you want to discuss a project, explore collaboration, or learn
            more about my work, get in touch.
          </p>
        </div>

        <div className="contact-card">
          <h3>Contact form</h3>
          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="contact-name">Name</label>
            <input id="contact-name" type="text" name="name" placeholder="Name" autoComplete="name" />

            <label className="sr-only" htmlFor="contact-email">Email</label>
            <input id="contact-email" type="email" name="email" placeholder="Email Address" autoComplete="email" />

            <label className="sr-only" htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" placeholder="Message" rows="5" />

            <div className="contact-actions">
              <a className="button-link" href="mailto:asif.rasool@selu.edu">Send Message</a>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
