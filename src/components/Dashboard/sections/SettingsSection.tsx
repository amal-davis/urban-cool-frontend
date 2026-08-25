import { useNavigate } from 'react-router-dom'
import { LogoutIcon } from '../../icons/Icons'
import type { NotificationPreferences } from '../../../data/dashboardData'
import './SettingsSection.css'
import './SectionCard.css'

interface SettingsSectionProps {
  preferences: NotificationPreferences
  onToggle: (key: keyof NotificationPreferences) => void
}

const notificationRows: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  {
    key: 'bookingReminders',
    label: 'Booking Reminders',
    description: 'Get notified before a scheduled service visit.',
  },
  {
    key: 'serviceUpdates',
    label: 'Service Status Updates',
    description: 'Technician assigned, on the way, and job-complete updates.',
  },
  {
    key: 'promotionalOffers',
    label: 'Promotional Offers',
    description: 'Occasional discounts and seasonal service offers.',
  },
]

/**
 * Settings — Notifications only. Language and Theme rows were left out
 * deliberately: neither is actually supported anywhere else in the app yet
 * (single locale, light-only color-scheme in index.css), and the brief is
 * explicit about not adding preferences the rest of the product can't
 * honor. All toggles are local frontend state (see UserDashboard.tsx).
 */
export function SettingsSection({ preferences, onToggle }: SettingsSectionProps) {
  const navigate = useNavigate()

  return (
    <>
      <div className="section-card">
        <h3 className="section-heading">Notifications</h3>
        <ul className="settings-list">
          {notificationRows.map(({ key, label, description }) => (
            <li key={key} className="settings-row">
              <span className="settings-row__text">
                <span className="settings-row__label">{label}</span>
                <span className="settings-row__description">{description}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={preferences[key]}
                aria-label={label}
                className={`toggle-switch${preferences[key] ? ' is-on' : ''}`}
                onClick={() => onToggle(key)}
              >
                <span className="toggle-switch__thumb" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h3 className="section-heading">Account</h3>
        {/* Frontend-only placeholder — no auth/session API to call yet (see
            accounts/views.py); this just returns to the homepage, matching
            what a real sign-out would visually do once one exists. */}
        <button type="button" className="btn btn--ghost settings-logout" onClick={() => navigate('/')}>
          <LogoutIcon /> Log Out
        </button>
      </div>
    </>
  )
}
