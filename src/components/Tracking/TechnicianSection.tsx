import { TechnicianIcon } from '../icons/Icons'
import { TechnicianCard } from './TechnicianCard'
import type { TrackingTechnician } from '../../data/tracking'

interface TechnicianSectionProps {
  technician: TrackingTechnician | null
}

/** Heading + TechnicianCard once a technician exists; a clearly-pending
 *  state instead of a fabricated technician when `technician` is null
 *  (BOOKED status — nobody's been assigned yet, see data/tracking.ts). */
export function TechnicianSection({ technician }: TechnicianSectionProps) {
  if (!technician) {
    return (
      <div className="tracking-section">
        <h2 className="tracking-section__heading">Technician Assignment</h2>
        <div className="technician-pending">
          <span className="technician-pending__icon" aria-hidden="true">
            <TechnicianIcon />
          </span>
          <p>Your technician will be assigned shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tracking-section">
      <h2 className="tracking-section__heading">Technician Assigned</h2>
      <TechnicianCard technician={technician} />
    </div>
  )
}
