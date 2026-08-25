import { Link } from 'react-router-dom'
import { CalendarIcon, ClockIcon, MapPinIcon } from '../../icons/Icons'
import { StatusBadge } from '../StatusBadge'
import { services } from '../../../data/services'
import { getTrackingDetails } from '../../../data/tracking'
import type { Booking } from '../../../data/dashboardData'
import './BookingCard.css'

interface BookingCardProps {
  booking: Booking
  onViewDetails: (booking: Booking) => void
}

export function BookingCard({ booking, onViewDetails }: BookingCardProps) {
  const service = services.find((item) => item.id === booking.serviceId)
  const ServiceIcon = service?.Icon
  // Only bookings the Service Tracking page actually has mock tracking data
  // for get a Track Service link (today: every non-cancelled booking — see
  // data/tracking.ts). Checking the real lookup, rather than assuming
  // `status !== 'cancelled'` always lines up with it, keeps this correct if
  // that mock dataset changes independently later.
  const isTrackable = getTrackingDetails(booking.id) !== undefined

  return (
    <div className="booking-card">
      <div className="booking-card__top">
        <span className="booking-card__icon" aria-hidden="true">
          {ServiceIcon && <ServiceIcon />}
        </span>
        <div className="booking-card__heading">
          <span className="booking-card__service">{booking.serviceName}</span>
          <span className="booking-card__ref">Booking ID: {booking.bookingRef}</span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="booking-card__meta">
        <span className="booking-card__meta-item">
          <CalendarIcon /> {booking.date}
        </span>
        <span className="booking-card__meta-item">
          <ClockIcon /> {booking.timeSlot}
        </span>
        <span className="booking-card__meta-item booking-card__meta-item--address">
          <MapPinIcon /> {booking.address}
        </span>
      </div>

      <div className="booking-card__footer">
        <span className="booking-card__price">₹{booking.price.toLocaleString('en-IN')}</span>
        <div className="booking-card__actions">
          <button type="button" className="btn btn--ghost" onClick={() => onViewDetails(booking)}>
            View Details
          </button>
          {isTrackable && (
            <Link to={`/track/${booking.id}`} className="btn btn--primary">
              Track Service
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
