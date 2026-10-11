/** Contact form rules, shared by the client form and the /api/contact route handler. */

export const MESSAGE_MAX = 500;
export const MESSAGE_MIN = 10;
export const NAME_MAX = 80;

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact({ name, email, message }: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const n = name.trim();
  const e = email.trim();
  const m = message.trim();

  if (!n) errors.name = "Please add your name.";
  else if (n.length > NAME_MAX) errors.name = `Keep it under ${NAME_MAX} characters.`;

  if (!e) errors.email = "Please add your email.";
  else if (!EMAIL_RE.test(e) || e.length > 254) errors.email = "That email doesn’t look right.";

  if (!m) errors.message = "Tell me a little about what you’re working on.";
  else if (m.length < MESSAGE_MIN) errors.message = `A bit more detail please (at least ${MESSAGE_MIN} characters).`;
  else if (m.length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`;

  return errors;
}
