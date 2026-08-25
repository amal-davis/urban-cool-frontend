import { useParams } from 'react-router-dom'
import { services } from '../data/services'
import { ServiceDetailTopBar } from '../components/ServiceDetailPage/ServiceDetailTopBar'
import { ServiceImage } from '../components/ServiceDetailPage/ServiceImage'
import { IncludedServices } from '../components/ServiceDetailPage/IncludedServices'
import { EstimatedPrice } from '../components/ServiceDetailPage/EstimatedPrice'
import { BookingCTA } from '../components/ServiceDetailPage/BookingCTA'
import { ServiceNotFound } from '../components/ServiceDetailPage/ServiceNotFound'
import { usePageMeta } from '../lib/usePageMeta'
import '../components/ServiceDetailPage/ServiceDetailPage.css'

/**
 * Reusable service detail page — one route, one component, driven entirely
 * by which service's data matches the :serviceId param (see data/services.ts
 * for the Service shape). Nothing here is service-specific; swap the URL
 * (/service/ac, /service/refrigerator, /service/washing-machine,
 * /service/microwave) and every field below — image, name, description,
 * included services, price — changes with it.
 *
 * Route param stays `id` (ac / washing-machine / microwave / refrigerator)
 * rather than an "-service" suffixed slug: that's the identifier every
 * other component in this project already keys services by (ServiceCard,
 * the Services page cards, SERVICE_ORDER). Introducing a second, differently
 * -shaped slug just for this page would mean maintaining two ids per
 * service for no real benefit — the brief itself calls the exact URL shape
 * illustrative ("do NOT assume this exact URL"), not a hard requirement.
 */
export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const service = services.find((item) => item.id === serviceId)

  usePageMeta(
    service ? `${service.ariaLabel} | Urban Cool` : 'Service Not Found | Urban Cool',
    service
      ? `${service.shortDescription} Estimated starting from ₹${service.startingPrice}. Book ${service.name.toLowerCase()} with Urban Cool.`
      : "The service you're looking for could not be found on Urban Cool.",
  )

  if (!service) {
    return (
      <section className="service-detail service-detail--not-found">
        <div className="container">
          <ServiceNotFound />
        </div>
      </section>
    )
  }

  return (
    <article className="service-detail" aria-labelledby="service-detail-heading">
      <div className="container">
        <ServiceDetailTopBar />

        <div className="service-detail__grid">
          <ServiceImage service={service} />

          <div className="service-detail__content">
            <p className="service-detail__eyebrow">Service Details</p>
            <h1 id="service-detail-heading" className="service-detail__name">
              {service.name}
            </h1>
            <p className="service-detail__description">{service.shortDescription}</p>

            <IncludedServices items={service.includedServices} />
            <EstimatedPrice startingPrice={service.startingPrice} priceLabel={service.priceLabel} />
            <BookingCTA serviceId={service.id} ariaLabel={service.ctaLabel} />
          </div>
        </div>
      </div>
    </article>
  )
}
