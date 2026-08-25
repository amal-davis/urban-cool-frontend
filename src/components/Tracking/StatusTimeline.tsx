import type { ComponentType, SVGProps } from 'react'
import { CalendarIcon, CarIcon, CheckCircleIcon, TechnicianIcon } from '../icons/Icons'
import { TRACKING_STATUS_STEPS } from '../../data/tracking'
import type { TrackingStatus } from '../../data/tracking'

interface StatusTimelineProps {
  status: TrackingStatus
}

const STEP_ICONS: Record<TrackingStatus, ComponentType<SVGProps<SVGSVGElement>>> = {
  BOOKED: CalendarIcon,
  ASSIGNED: TechnicianIcon,
  ON_THE_WAY: CarIcon,
  COMPLETED: CheckCircleIcon,
}

type StepState = 'completed' | 'active' | 'pending'

/**
 * Four-step progress tracker (Booked -> Assigned -> On The Way ->
 * Completed), entirely driven by `TRACKING_STATUS_STEPS` (data/tracking.ts)
 * and the current `status` — never a per-status hardcoded layout. The
 * connecting line's fill width is a single continuous percentage
 * (`activeIndex / (steps.length - 1)`), not per-segment toggles, so it
 * reads as one progress bar rather than four independently-lit dashes.
 *
 * State is never color-only (DESIGN.md's No-Gray-Status Rule, and the
 * brief's own accessibility requirement): each step also gets its own
 * icon, its label, and a visually-hidden state word for screen readers.
 */
export function StatusTimeline({ status }: StatusTimelineProps) {
  const activeIndex = TRACKING_STATUS_STEPS.findIndex((step) => step.id === status)
  const progressPercent = TRACKING_STATUS_STEPS.length > 1 ? (activeIndex / (TRACKING_STATUS_STEPS.length - 1)) * 100 : 0

  function stateFor(index: number): StepState {
    if (index < activeIndex) return 'completed'
    if (index === activeIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="status-timeline">
      {/* Decorative — the ol/li structure below carries the actual
          semantics; this is purely the visual connecting line, positioned
          to span exactly from the first dot's center to the last dot's
          center (100% / (2 * steps.length)) on each side — derived from the
          equal-width step columns, not an arbitrary offset. */}
      <div
        className="status-timeline__track"
        aria-hidden="true"
        style={{
          left: `${100 / (TRACKING_STATUS_STEPS.length * 2)}%`,
          right: `${100 / (TRACKING_STATUS_STEPS.length * 2)}%`,
        }}
      >
        <div className="status-timeline__track-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <ol className="status-timeline__steps" aria-label="Service tracking status">
        {TRACKING_STATUS_STEPS.map((step, index) => {
          const state = stateFor(index)
          const Icon = STEP_ICONS[step.id]
          return (
            <li
              key={step.id}
              className={`status-timeline__step status-timeline__step--${state}`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="status-timeline__dot">
                <Icon aria-hidden="true" />
              </span>
              <span className="status-timeline__label">
                {step.label}
                <span className="visually-hidden">
                  {state === 'completed' ? ' (completed)' : state === 'active' ? ' (current step)' : ' (upcoming)'}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
