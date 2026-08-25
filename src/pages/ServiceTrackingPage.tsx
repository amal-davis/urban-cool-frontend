import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { mockBookings } from '../data/dashboardData'
import { services } from '../data/services'
import { getTrackingDetails } from '../data/tracking'
import { ChevronLeftIcon, ChatIcon } from '../components/icons/Icons'
import { BookingNotFound } from '../components/Tracking/BookingNotFound'
import { BookingSummaryCard } from '../components/Tracking/BookingSummaryCard'
import { BookingDetailsCard } from '../components/Tracking/BookingDetailsCard'
import { StatusTimeline } from '../components/Tracking/StatusTimeline'
import { CurrentStatusMessage } from '../components/Tracking/CurrentStatusMessage'
import { TechnicianSection } from '../components/Tracking/TechnicianSection'
import { TrackingMap } from '../components/Tracking/TrackingMap'
import { ChatModal } from '../components/Tracking/ChatModal'
import { CompletedSummary } from '../components/Tracking/CompletedSummary'
import { usePageMeta } from '../lib/usePageMeta'
import '../components/ServiceDetailPage/ServiceDetailPage.css'
import '../components/Tracking/TrackingPage.css'

const LOCATION_SECTION_COPY: Record<string, { heading: string; subtext?: string }> = {
  BOOKED: { heading: 'Service Location' },
  ASSIGNED: { heading: 'Technician Location' },
  ON_THE_WAY: { heading: 'Live Location', subtext: 'Your technician is on the way' },
}

/**
 * Reusable Service Tracking page — one route (/track/:bookingId), one
 * component, driven by whichever booking matches the param. Follows the
 * exact same pattern as ServiceDetailPage/BookingPage: look up static mock
 * data by id, render a Not Found state if nothing matches, otherwise
 * render every section from that one record.
 *
 * On "loading" states: BookingSummaryCard/TechnicianSection/TrackingMap
 * all render synchronously from local mock data — there's no real network
 * request happening yet, so this deliberately does NOT show a fake
 * "Loading booking…" spinner for something that isn't actually async (this
 * project's own App.tsx explicitly rejects fabricated loading delays for
 * the same reason — see its lazy-loading comment). The one place a real
 * loading state exists today is Google Maps' script load, which
 * TrackingMap already handles. Swapping the lookups below for real
 * `fetch`/`useQuery` calls later is exactly where a genuine
 * "Loading booking…" state would then belong.
 */
export function ServiceTrackingPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)

  usePageMeta(
    'Track Your Service | Urban Cool',
    'Track your Urban Cool service booking, technician, and live location.',
  )

  const booking = mockBookings.find((item) => item.id === bookingId)
  const tracking = bookingId ? getTrackingDetails(bookingId) : undefined

  if (!booking || !tracking) {
    return (
      <section className="service-detail service-detail--not-found">
        <div className="container">
          <BookingNotFound />
        </div>
      </section>
    )
  }

  const service = services.find((item) => item.id === booking.serviceId)
  const { status, technician, customerLocation, technicianLocation } = tracking

  const showMap = status !== 'COMPLETED'
  const showChat = technician !== null && status !== 'COMPLETED'
  const locationCopy = LOCATION_SECTION_COPY[status]

  return (
    <article className="tracking-page">
      <div className="container">
        <header className="tracking-page__header">
          <button
            type="button"
            className="service-detail__back tracking-page__back"
            onClick={() => navigate('/dashboard')}
            aria-label="Back to My Bookings"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className="tracking-page__heading">Track Your Service</h1>
        </header>

        <div className="tracking-page__grid">
          <div className="tracking-page__left">
            <BookingSummaryCard booking={booking} service={service} />

            <div className="tracking-section">
              <StatusTimeline status={status} />
              <CurrentStatusMessage status={status} />
            </div>

            <TechnicianSection technician={technician} />

            {status === 'COMPLETED' && <CompletedSummary serviceId={booking.serviceId} />}
          </div>

          <div className="tracking-page__right">
            {showMap && (
              <div className="tracking-section">
                {locationCopy && (
                  <>
                    <h2 className="tracking-section__heading">{locationCopy.heading}</h2>
                    {locationCopy.subtext && <p className="tracking-section__hint">{locationCopy.subtext}</p>}
                  </>
                )}
                <TrackingMap
                  customerLocation={customerLocation}
                  technicianLocation={technicianLocation}
                  showRoute={status === 'ON_THE_WAY'}
                />
              </div>
            )}
          </div>
        </div>

        {showChat && (
          <div className="tracking-page__chat-cta">
            <button type="button" className="btn btn--accent" onClick={() => setChatOpen(true)}>
              <ChatIcon aria-hidden="true" /> Chat with Technician
            </button>
          </div>
        )}

        <BookingDetailsCard booking={booking} />
      </div>

      {technician && (
        <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} technicianName={technician.name} />
      )}
    </article>
  )
}
