import { CheckCircleIcon } from '../icons/Icons'
import type { Service } from '../../data/services'
import './ServiceDetail.css'

interface ServiceDetailProps {
  service: Service
  /** Desktop only — mirrors the image/content side. Mobile always renders
   *  Image then Content regardless of this, handled in CSS (see
   *  ServiceDetail.css) rather than by changing DOM order per card, so the
   *  stacked mobile order stays consistent across all four services. */
  reverse: boolean
}

export function ServiceDetail({ service, reverse }: ServiceDetailProps) {
  const { id, ariaLabel, detailIntro, helpWith, ctaLabel, Icon, imageUrl } = service
  const cardId = `${id}-service`
  const headingId = `${cardId}-heading`

  return (
    <article id={cardId} className="service-card-detail" aria-labelledby={headingId}>
      <div className={`service-card-detail__grid${reverse ? ' service-card-detail__grid--reverse' : ''}`}>
        <div className="service-card-detail__media">
          {imageUrl ? (
            <img src={imageUrl} alt={`${ariaLabel} image`} className="service-card-detail__photo" />
          ) : (
            <Icon className="service-card-detail__icon" aria-hidden="true" />
          )}
        </div>

        <div className="service-card-detail__content">
          <h2 id={headingId} className="service-card-detail__heading">
            {ariaLabel}
          </h2>
          <p className="service-card-detail__intro">{detailIntro}</p>

          <h3 className="service-card-detail__help-heading">What We Can Help With</h3>
          <ul className="service-card-detail__help-list">
            {helpWith.map((item) => (
              <li key={item}>
                <CheckCircleIcon aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* TODO: wire to the real booking flow once it exists — same
              "Coming soon" pattern used across the site. */}
          <button type="button" className="btn btn--accent" title="Coming soon">
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  )
}
