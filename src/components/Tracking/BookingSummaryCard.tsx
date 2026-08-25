import { CalendarIcon, ClockIcon } from '../icons/Icons'
import type { Booking } from '../../data/dashboardData'
import type { Service } from '../../data/services'

interface BookingSummaryCardProps {
  booking: Booking
  service: Service | undefined
}

/** Compact "what am I tracking" context near the top of the page — service
 *  name, booking ID, and schedule only. Deliberately excludes address/price
 *  (see BookingDetailsCard, rendered further down) so this stays a quick
 *  orientation glance, not a second full booking-details block. */
export function BookingSummaryCard({ booking, service }: BookingSummaryCardProps) {
  return (
    <div className="booking-summary-card">
      <span className="booking-summary-card__icon" aria-hidden="true">
        {service?.Icon && <service.Icon />}
      </span>
      <div className="booking-summary-card__heading">
        <h2 className="booking-summary-card__service">{booking.serviceName}</h2>
        <span className="booking-summary-card__ref">Booking ID: {booking.bookingRef}</span>
      </div>
      <div className="booking-summary-card__schedule">
        <span>
          <CalendarIcon aria-hidden="true" /> {booking.date}
        </span>
        <span>
          <ClockIcon aria-hidden="true" /> {booking.timeSlot}
        </span>
      </div>
    </div>
  )
}
