export interface ContactFormPayload {
  name: string
  email: string
  phone: string
  message: string
}

export class ContactApiNotConfiguredError extends Error {
  constructor() {
    super('No contact-submission endpoint is configured yet.')
    this.name = 'ContactApiNotConfiguredError'
  }
}

/**
 * Intentionally isolated so a real backend call can replace the body below
 * without touching ContactForm.tsx at all — the form only ever calls this
 * function and handles whatever it resolves/rejects with.
 *
 * There is currently no contact-submission endpoint: the Django backend
 * (backend/bookings/urls.py) only exposes GET /api/health/. This does NOT
 * fake success — real user-typed messages don't get silently discarded
 * while looking like they were sent. It validates the payload shape (a
 * genuine, useful check) and then deliberately rejects, so the UI can show
 * an honest "not connected yet" state instead of a fabricated confirmation.
 *
 * To wire up a real backend later: add a POST endpoint (e.g.
 * `bookings/views.py::contact` at `/api/contact/`), then replace the body
 * of this function with a `fetch('/api/contact/', { method: 'POST', ... })`
 * call. Nothing outside this file needs to change.
 */
export async function submitContactMessage(payload: ContactFormPayload): Promise<void> {
  if (!payload.name || !payload.email || !payload.phone || !payload.message) {
    throw new Error('Missing required field.')
  }

  // Small delay so the loading state isn't a jarring instant flash — not a
  // simulated network round-trip, just UI smoothing before the honest
  // "not connected" result below.
  await new Promise((resolve) => setTimeout(resolve, 300))

  throw new ContactApiNotConfiguredError()
}
