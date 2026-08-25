import { formatGroupedIndianMobile } from '../../lib/indianPhone'
import { PRICE_DISCLAIMER } from '../../data/services'
import type { BookingFormValues } from '../../data/booking'
import type { Service } from '../../data/services'

interface BookingReviewProps {
  service: Service
  values: BookingFormValues
  onEdit: () => void
  onConfirm: () => void
}

/**
 * Frontend-only review step between the form and BookingSuccess — no
 * booking is created anywhere here (no API exists yet, see BookingPage.tsx).
 * Confirm Booking only advances local step state to 'success'.
 */
export function BookingReview({ service, values, onEdit, onConfirm }: BookingReviewProps) {
  const { customer, address, location, complaint, images } = values
  const formattedAddress = `${address.houseNumber}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`

  return (
    <div className="booking-review">
      <h1 className="booking-page__heading">Review Your Booking</h1>
      <p className="booking-page__subtext">Please check your details before confirming your service request.</p>

      <dl className="booking-review__list">
        <div className="booking-review__row">
          <dt>Service</dt>
          <dd>{service.name}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Customer</dt>
          <dd>{customer.fullName}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Email</dt>
          <dd>{customer.email}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Mobile</dt>
          <dd>+91 {formatGroupedIndianMobile(customer.phone)}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Address</dt>
          <dd>{formattedAddress}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Location</dt>
          <dd>{location.latitude != null ? location.address ?? 'Selected on map' : 'Not pinned — using the address above'}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Complaint</dt>
          <dd>{complaint}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Images</dt>
          <dd>{images.length > 0 ? `${images.length} uploaded` : 'None uploaded'}</dd>
        </div>
        <div className="booking-review__row">
          <dt>Estimated Starting Price</dt>
          <dd className="booking-review__price">₹{service.startingPrice}</dd>
        </div>
      </dl>

      <p className="booking-review__note">{PRICE_DISCLAIMER}</p>

      <div className="booking-review__actions">
        <button type="button" className="btn btn--ghost" onClick={onEdit}>
          Edit Details
        </button>
        <button type="button" className="btn btn--accent" onClick={onConfirm}>
          Confirm Booking
        </button>
      </div>
    </div>
  )
}
