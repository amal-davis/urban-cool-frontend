import { useState } from 'react'
import { CalendarIcon, ClockIcon, MapPinIcon } from '../../icons/Icons'
import { Modal } from '../../Modal/Modal'
import { StatusBadge } from '../StatusBadge'
import { BookingCard } from './BookingCard'
import { bookingStatusLabels } from '../../../data/dashboardData'
import type { Booking, BookingStatus } from '../../../data/dashboardData'
import './BookingsSection.css'
import './SectionCard.css'

interface BookingsSectionProps {
  bookings: Booking[]
}

type FilterId = 'all' | BookingStatus

const filters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: bookingStatusLabels.upcoming },
  { id: 'in-progress', label: bookingStatusLabels['in-progress'] },
  { id: 'completed', label: bookingStatusLabels.completed },
  { id: 'cancelled', label: bookingStatusLabels.cancelled },
]

/** My Bookings — static booking history with an All/status filter and a
 *  details modal per card. Read-only (no reschedule/cancel mutation): the
 *  brief scopes CRUD-style frontend state to Address only, bookings here
 *  are display + filter, matching what "static booking cards" asks for. */
export function BookingsSection({ bookings }: BookingsSectionProps) {
  const [filter, setFilter] = useState<FilterId>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const visibleBookings = filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter)
  const activeFilterLabel = filters.find((item) => item.id === filter)?.label

  return (
    <>
      <div className="booking-filters" role="tablist" aria-label="Filter bookings by status">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={`booking-filter${filter === id ? ' is-active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleBookings.length === 0 ? (
        <div className="section-card">
          <div className="section-empty">
            <CalendarIcon />
            <p className="section-text">
              No {filter === 'all' ? '' : `${activeFilterLabel?.toLowerCase()} `}bookings to show.
            </p>
          </div>
        </div>
      ) : (
        <div className="booking-list">
          {visibleBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onViewDetails={setSelectedBooking} />
          ))}
        </div>
      )}

      <Modal
        open={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking?.serviceName ?? 'Booking Details'}
      >
        {selectedBooking && (
          <div className="booking-detail">
            <StatusBadge status={selectedBooking.status} />
            <dl className="booking-detail__list">
              <div className="booking-detail__row">
                <dt>Booking ID</dt>
                <dd>{selectedBooking.bookingRef}</dd>
              </div>
              <div className="booking-detail__row">
                <dt>
                  <CalendarIcon /> Date
                </dt>
                <dd>{selectedBooking.date}</dd>
              </div>
              <div className="booking-detail__row">
                <dt>
                  <ClockIcon /> Time
                </dt>
                <dd>{selectedBooking.timeSlot}</dd>
              </div>
              <div className="booking-detail__row">
                <dt>
                  <MapPinIcon /> Address
                </dt>
                <dd>{selectedBooking.address}</dd>
              </div>
              <div className="booking-detail__row">
                <dt>Amount</dt>
                <dd>₹{selectedBooking.price.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </>
  )
}
