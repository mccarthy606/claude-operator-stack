"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import styles from "./lead-form.module.css";

type LeadFormProps = {
  source?: string;
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadForm({ source = "site" }: LeadFormProps) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const honeypot = String(formData.get("website") ?? "").trim();

    if (honeypot) {
      // Bot filled the hidden field; pretend success and drop it.
      setState({ status: "success" });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setState({ status: "error", message: "Enter a valid email address." });
      return;
    }

    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || null,
          message: message || null,
          source,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const detail =
          typeof payload?.error === "string"
            ? payload.error
            : "Something went wrong. Try again.";
        setState({ status: "error", message: detail });
        return;
      }

      setState({ status: "success" });
      event.currentTarget.reset();
    } catch (_err) {
      setState({
        status: "error",
        message: "Network error. Try again in a moment.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        You&rsquo;re on the list. Watch your inbox.
      </p>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={state.status === "submitting"}
    >
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <Input label="Name (optional)" name="name" type="text" />
      <Input label="What are you trying to solve? (optional)" name="message" type="text" />

      {/* Honeypot — hidden from real users, often filled by bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" disabled={state.status === "submitting"}>
        {state.status === "submitting" ? "Sending..." : "Send"}
      </Button>

      {state.status === "error" ? (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
