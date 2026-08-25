import { Link } from 'react-router-dom'
import { StarIcon } from '../icons/Icons'

interface CompletedSummaryProps {
  serviceId: string
}

/** COMPLETED-status actions — View Service Details (a real link to that
 *  service's own /service/:id page — the fuller service description/
 *  included-services list lives there, not duplicated on this booking-
 *  specific page) and Rate Technician. No rating flow exists yet anywhere
 *  in this project, so Rate Technician follows the site's established
 *  "Coming soon" placeholder convention (see ServiceCard/FinalCTA/
 *  BookingCTA before this task) rather than a fake submission. */
export function CompletedSummary({ serviceId }: CompletedSummaryProps) {
  return (
    <div className="completed-summary">
      <Link to={`/service/${serviceId}`} className="btn btn--ghost">
        View Service Details
      </Link>
      <button type="button" className="btn btn--primary" title="Coming soon">
        <StarIcon aria-hidden="true" /> Rate Technician
      </button>
    </div>
  )
}
