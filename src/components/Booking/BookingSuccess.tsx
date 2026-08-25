import { Link } from 'react-router-dom'
import { CheckCircleIcon } from '../icons/Icons'
import type { Service } from '../../data/services'

interface BookingSuccessProps {
  service: Service
}

/**
 * Frontend-only confirmation state — reached after BookingReview's Confirm
 * Booking. No backend/database booking is created (no booking API exists
 * yet, per the brief); the note at the bottom says so explicitly rather
 * than implying a real booking now exists somewhere.
 */
export function BookingSuccess({ service }: BookingSuccessProps) {
  return (
    <div className="booking-success">
      <span className="booking-success__icon" aria-hidden="true">
        <CheckCircleIcon />
      </span>

      <h1 className="booking-page__heading">Booking Request Submitted</h1>
      <p className="booking-success__message">Your service request has been recorded.</p>

      <div className="booking-success__service">
        <span className="booking-success__service-label">Service</span>
        <span className="booking-success__service-name">{service.name}</span>
      </div>

      <p className="booking-success__followup">
        Our team will review your request and contact you regarding the service.
      </p>

      <p className="booking-success__demo-note">
        This is a frontend demo confirmation — no live booking system is connected yet, so nothing has been saved to
        a real account or database.
      </p>

      <div className="booking-success__actions">
        <Link to="/" className="btn btn--ghost">
          Back to Home
        </Link>
        <Link to="/dashboard" className="btn btn--primary">
          View My Bookings
        </Link>
      </div>
    </div>
  )
}
