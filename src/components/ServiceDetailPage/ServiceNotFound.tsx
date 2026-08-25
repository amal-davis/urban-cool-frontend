import { NavLink } from 'react-router-dom'
import { GridIcon } from '../icons/Icons'

/**
 * Rendered instead of the detail layout when the /service/:serviceId slug
 * doesn't match any known service (typo, stale link, removed service) — a
 * clean, on-brand state rather than a runtime error or blank screen.
 */
export function ServiceNotFound() {
  return (
    <div className="service-not-found">
      <span className="service-not-found__badge" aria-hidden="true">
        <GridIcon />
      </span>
      <h1 className="service-not-found__heading">Service Not Found</h1>
      <p className="service-not-found__description">
        We couldn't find the service you're looking for. It may have been renamed or is no longer available.
      </p>
      <NavLink to="/services" className="btn btn--primary">
        View Services
      </NavLink>
    </div>
  )
}
