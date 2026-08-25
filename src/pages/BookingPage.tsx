import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { services } from '../data/services'
import { createInitialBookingFormValues } from '../data/booking'
import type { BookingFormValues } from '../data/booking'
import { ChevronLeftIcon } from '../components/icons/Icons'
import { ServiceNotFound } from '../components/ServiceDetailPage/ServiceNotFound'
import { BookingForm } from '../components/Booking/BookingForm'
import { BookingSummary } from '../components/Booking/BookingSummary'
import { BookingReview } from '../components/Booking/BookingReview'
import { BookingSuccess } from '../components/Booking/BookingSuccess'
import { Toast } from '../components/Toast/Toast'
import { usePageMeta } from '../lib/usePageMeta'
import '../components/ServiceDetailPage/ServiceDetailPage.css'
import '../components/Booking/BookingPage.css'

type Step = 'form' | 'review' | 'success'

/**
 * Reusable booking page — one route (/booking/:serviceId), one component,
 * driven by whichever service's data matches the param (see
 * data/services.ts), same approach as ServiceDetailPage. Owns the entire
 * booking flow's state (current step + the form values every child reads
 * and writes through controlled props) rather than splitting it across
 * routes — there's no existing booking-confirmation route to hand off to
 * (checked App.tsx), so this creates the frontend review/success states
 * locally per the brief instead of inventing new routes for them.
 */
export function BookingPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const service = services.find((item) => item.id === serviceId)

  usePageMeta(
    service ? `Book ${service.name} | Urban Cool` : 'Service Not Found | Urban Cool',
    service
      ? `Book ${service.name.toLowerCase()} with Urban Cool. Estimated starting from ₹${service.startingPrice}.`
      : "The service you're looking for could not be found on Urban Cool.",
  )

  // Hooks must run unconditionally, so these are declared before the
  // invalid-service early return below even though they're only used once
  // `service` is confirmed to exist.
  const [step, setStep] = useState<Step>('form')
  const [values, setValues] = useState<BookingFormValues | null>(null)
  const [imageErrorToast, setImageErrorToast] = useState<string | null>(null)

  // App.tsx's ScrollToTop only fires on route (pathname) changes — this is
  // an in-page step change, so without this a customer who scrolled deep
  // into the form before clicking Continue would land on Review already
  // scrolled past its heading.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [step])

  // Object URLs for uploaded image previews (see data/booking.ts's
  // BookingImageFile) live for as long as this page does — ImageUploader
  // itself unmounts on every step change (form -> review -> success) while
  // `values` stays alive, so it can't own this cleanup without breaking
  // previews the moment the customer leaves the form step. This revokes
  // whatever's still outstanding only when the booking page itself
  // unmounts (navigating away entirely); individual removals still revoke
  // their own URL immediately in ImageUploader.
  const imagesRef = useRef(values?.images ?? [])
  useEffect(() => {
    imagesRef.current = values?.images ?? []
  })
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    }
  }, [])

  if (!service) {
    return (
      <section className="service-detail service-detail--not-found">
        <div className="container">
          <ServiceNotFound />
        </div>
      </section>
    )
  }

  // Lazily seeded on first render once `service` is known, rather than a
  // second `useState(() => ...)` above the early return — this keeps the
  // prefill (mockUser — see data/booking.ts) tied to whichever service
  // actually resolved.
  const currentValues = values ?? createInitialBookingFormValues(service)

  function handleBackToService() {
    navigate(`/service/${service!.id}`)
  }

  return (
    <article className="booking-page">
      <div className="container">
        <button type="button" className="service-detail__back booking-page__back" onClick={handleBackToService}>
          <ChevronLeftIcon />
          <span>Back to Service</span>
        </button>

        {step === 'form' && (
          <>
            <div className="booking-page__intro">
              <h1 className="booking-page__heading">Book Your Service</h1>
              <p className="booking-page__subtext">
                Tell us a little about your service requirement and we'll help you get it sorted.
              </p>
            </div>

            <div className="booking-page__grid">
              <BookingForm
                values={currentValues}
                onChange={setValues}
                onImageError={setImageErrorToast}
                onContinue={() => setStep('review')}
              />
              <BookingSummary service={service} />
            </div>
          </>
        )}

        {step === 'review' && (
          <BookingReview
            service={service}
            values={currentValues}
            onEdit={() => setStep('form')}
            onConfirm={() => setStep('success')}
          />
        )}

        {step === 'success' && <BookingSuccess service={service} />}
      </div>

      <Toast message={imageErrorToast} onDismiss={() => setImageErrorToast(null)} />
    </article>
  )
}
