import { CheckCircleIcon, PencilIcon } from '../../icons/Icons'
import { formatGroupedIndianMobile } from '../../../lib/indianPhone'
import type { DashboardUser } from '../../../data/dashboardData'
import './SectionCard.css'

interface ProfileOverviewSectionProps {
  user: DashboardUser
  onEditClick: () => void
}

/** Desktop-only in practice — the content panel's default section before
 *  any menu row is clicked (see UserDashboard.tsx). Mobile never reaches
 *  this: there's no "My Profile" row in the menu, since the profile
 *  summary itself is always on-screen there (see the mobile reference). */
export function ProfileOverviewSection({ user, onEditClick }: ProfileOverviewSectionProps) {
  return (
    <div className="section-card">
      <h3 className="section-heading">Account Details</h3>
      <div className="detail-list">
        <div className="detail-row">
          <span className="detail-row__label">Full Name</span>
          <span className="detail-row__value">{user.fullName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Mobile Number</span>
          <span className="detail-row__value">
            +91 {formatGroupedIndianMobile(user.phone)} <CheckCircleIcon className="detail-row__verified-icon" />
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Email Address</span>
          <span className="detail-row__value">{user.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row__label">Member Since</span>
          <span className="detail-row__value">{user.memberSince}</span>
        </div>
      </div>
      <button type="button" className="btn btn--ghost section-card__action" onClick={onEditClick}>
        <PencilIcon /> Edit Profile
      </button>
    </div>
  )
}
