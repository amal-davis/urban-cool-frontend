import { bookingStatusLabels } from '../../data/dashboardData'
import type { BookingStatus } from '../../data/dashboardData'
import './StatusBadge.css'

interface StatusBadgeProps {
  status: BookingStatus
}

/**
 * Booking status pill. Colors are pulled straight from DESIGN.md's own
 * Status section rather than invented for this component — Confirmed Green
 * is literally defined there as "...job complete" (-> completed), Pending
 * Amber as "...technician en route" (-> in-progress), and Dispatch Red's
 * Secondary-color entry explicitly lists "cancellation" as one of its
 * reserved uses (-> cancelled). Upcoming has no dedicated status token, so
 * it uses Signal Blue — the system's own default/structural color.
 *
 * Every variant renders text, never color alone (DESIGN.md's No-Gray-Status
 * Rule), and uses the light-tint-background + solid-text formula
 * ContactForm.css's own error notice already established in this codebase,
 * rather than a solid fill (avoids re-deriving a white-text contrast ratio
 * for --color-warning, which DESIGN.md explicitly says not to pair with
 * white).
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{bookingStatusLabels[status]}</span>
}
