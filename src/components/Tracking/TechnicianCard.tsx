import { PhoneIcon, StarIcon } from '../icons/Icons'
import { formatGroupedIndianMobile, toE164 } from '../../lib/indianPhone'
import { initialsFor } from '../../lib/initials'
import type { TrackingTechnician } from '../../data/tracking'

interface TechnicianCardProps {
  technician: TrackingTechnician
}

/**
 * Photo (or initials fallback — same pattern as ProfileHeader's avatar, via
 * lib/initials.ts) + name + rating + Call. `technician.image` failing to
 * load can't break the layout: the `<img>` only ever renders when `image`
 * is set, and a broken `src` still occupies the same fixed circular slot
 * the initials fallback would (see TrackingPage.css).
 *
 * Call uses a real `tel:` link built from `technician.phone` — never a
 * hardcoded number — with a full accessible name ("Call technician
 * {name}"), not just an icon.
 */
export function TechnicianCard({ technician }: TechnicianCardProps) {
  return (
    <div className="technician-card">
      <div className="technician-card__avatar" aria-hidden="true">
        {technician.image ? (
          <img src={technician.image} alt="" className="technician-card__avatar-image" />
        ) : (
          <span className="technician-card__avatar-initials">{initialsFor(technician.name)}</span>
        )}
      </div>

      <div className="technician-card__info">
        <span className="technician-card__name">{technician.name}</span>
        <span className="technician-card__rating">
          <StarIcon aria-hidden="true" />
          {technician.rating.toFixed(1)}
          <span className="technician-card__review-count">({technician.reviewCount}+)</span>
        </span>
      </div>

      <a
        href={`tel:${toE164(technician.phone)}`}
        className="technician-card__call icon-button"
        aria-label={`Call technician ${technician.name}, +91 ${formatGroupedIndianMobile(technician.phone)}`}
      >
        <PhoneIcon aria-hidden="true" />
      </a>
    </div>
  )
}
