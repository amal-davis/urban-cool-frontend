import { CheckCircleIcon, PencilIcon } from '../icons/Icons'
import { formatGroupedIndianMobile } from '../../lib/indianPhone'
import { initialsFor } from '../../lib/initials'
import type { DashboardUser } from '../../data/dashboardData'
import './ProfileHeader.css'

interface ProfileHeaderProps {
  user: DashboardUser
  onEditClick: () => void
}

/** Top-of-sidebar / top-of-mobile-list profile summary — avatar, name,
 *  verified phone, Edit Profile. Same component renders it in both the
 *  desktop sidebar and the mobile list (DashboardPage.css repositions/
 *  resizes it per breakpoint); it's never squeezed-desktop-card-on-mobile,
 *  it's one shared piece of markup styled twice. */
export function ProfileHeader({ user, onEditClick }: ProfileHeaderProps) {
  return (
    <div className="profile-summary">
      <div className="profile-summary__avatar" aria-hidden="true">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="profile-summary__avatar-image" />
        ) : (
          <span className="profile-summary__avatar-initials">{initialsFor(user.fullName)}</span>
        )}
      </div>

      {/* h2, not h1 — DashboardPage's PageHeader already carries the page's
          one h1 ("My Account"), visually-hidden on mobile but still present
          in the accessibility tree there (see PageHeader.css). */}
      <h2 className="profile-summary__name">{user.fullName}</h2>

      <p className="profile-summary__phone">
        +91 {formatGroupedIndianMobile(user.phone)}
        <span className="profile-summary__verified">
          <CheckCircleIcon /> Verified
        </span>
      </p>

      <button type="button" className="btn btn--ghost profile-summary__edit" onClick={onEditClick}>
        <PencilIcon /> Edit Profile
      </button>
    </div>
  )
}
