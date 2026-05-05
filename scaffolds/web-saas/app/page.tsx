import { LeadForm } from "../components/lead-form";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.shell}>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div>
          <span className={styles.eyebrow}>Replace this eyebrow</span>
          <h1 id="hero-heading" className={styles.title}>
            One headline that earns
            <br />
            the visitor&rsquo;s attention.
          </h1>
          <p className={styles.subtitle}>
            One subhead that says, plainly, what the product does and who it is
            for. No marketing fluff, no tricolons, no &ldquo;X is not Y, it is
            Z.&rdquo;
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <h2>Get on the early list</h2>
            <p>
              Drop your email. Server-side capture, instant Telegram alert if
              the bot is wired.
            </p>
          </div>
          <LeadForm source="hero" />
        </div>
      </section>

      <footer className={styles.footer}>
        <span>&copy; {new Date().getFullYear()} Your product name</span>
        <nav aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="mailto:hello@example.com">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
