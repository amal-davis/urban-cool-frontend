import { TRACKING_STATUS_MESSAGES } from '../../data/tracking'
import type { TrackingStatus } from '../../data/tracking'

interface CurrentStatusMessageProps {
  status: TrackingStatus
}

/** One line of plain-language status copy below StatusTimeline — pulled
 *  from TRACKING_STATUS_MESSAGES (data/tracking.ts), never hardcoded per
 *  status here. */
export function CurrentStatusMessage({ status }: CurrentStatusMessageProps) {
  return (
    <p className="status-timeline__message" role="status">
      {TRACKING_STATUS_MESSAGES[status]}
    </p>
  )
}
