import { useState } from 'react'
import { ChevronLeftIcon } from '../icons/Icons'
import { ProfileHeader } from './ProfileHeader'
import { DashboardMenu } from './DashboardMenu'
import { EditProfileModal } from './EditProfileModal'
import { dashboardMenuItems } from './dashboardMenuItems'
import type { DashboardSectionId } from './dashboardMenuItems'
import { ProfileOverviewSection } from './sections/ProfileOverviewSection'
import { AddressSection } from './sections/AddressSection'
import { PaymentMethodSection } from './sections/PaymentMethodSection'
import { BookingsSection } from './sections/BookingsSection'
import { SupportSection } from './sections/SupportSection'
import { AboutSection } from './sections/AboutSection'
import { PrivacySection } from './sections/PrivacySection'
import { SettingsSection } from './sections/SettingsSection'
import { Toast } from '../Toast/Toast'
import {
  DEFAULT_PAYMENT_METHOD_ID,
  mockAddresses,
  mockBookings,
  mockNotificationPreferences,
  mockUser,
  paymentMethodOptions,
} from '../../data/dashboardData'
import type { Address, DashboardUser, NotificationPreferences, PaymentMethodId } from '../../data/dashboardData'
import './UserDashboard.css'

/**
 * Owns every piece of "server state" the dashboard shows — user profile,
 * addresses, payment preference, bookings, notification preferences — each
 * seeded from data/dashboardData.ts's mock objects via plain useState. This
 * is the one place a future backend integration touches: swap a
 * `useState(mockUser)` for a `useQuery`/fetch-on-mount, keep the setters'
 * call sites the same (or point them at a mutation), and none of the
 * section components below need to change — they already just take data +
 * callbacks as props. Bookings are the one exception with no setter, since
 * nothing here mutates them (see BookingsSection's own comment).
 *
 * Also owns `activeSection`, which is the whole "desktop sidebar+panel /
 * mobile list+detail" layout in one piece of state — see the JSX below and
 * UserDashboard.css for how the same state drives both.
 */
export function UserDashboard() {
  const [user, setUser] = useState<DashboardUser>(mockUser)
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId>(DEFAULT_PAYMENT_METHOD_ID)
  const [notifications, setNotifications] = useState<NotificationPreferences>(mockNotificationPreferences)

  const [activeSection, setActiveSection] = useState<DashboardSectionId | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function handleSaveProfile(values: { fullName: string; email: string }) {
    // Frontend-state-only update — a real integration would await a
    // PUT /api/profile/ here first and only update local state (and show
    // the toast) on success, surfacing an error otherwise.
    setUser((current) => ({ ...current, ...values }))
    setEditModalOpen(false)
    setToastMessage('Profile updated successfully.')
  }

  function handleAddAddress(values: Omit<Address, 'id' | 'isDefault'>) {
    setAddresses((current) => [...current, { ...values, id: `addr-${Date.now()}`, isDefault: current.length === 0 }])
    setToastMessage('Address added.')
  }

  function handleUpdateAddress(id: string, values: Omit<Address, 'id' | 'isDefault'>) {
    setAddresses((current) => current.map((address) => (address.id === id ? { ...address, ...values } : address)))
    setToastMessage('Address updated.')
  }

  function handleDeleteAddress(id: string) {
    setAddresses((current) => current.filter((address) => address.id !== id))
    setToastMessage('Address removed.')
  }

  function handleToggleNotification(key: keyof NotificationPreferences) {
    setNotifications((current) => ({ ...current, [key]: !current[key] }))
  }

  const paymentSubtitle = paymentMethodOptions.find((option) => option.id === paymentMethodId)?.label ?? ''
  const activeSectionLabel =
    activeSection === null || activeSection === 'profile'
      ? 'My Profile'
      : dashboardMenuItems.find((item) => item.id === activeSection)?.label

  function renderContent() {
    switch (activeSection ?? 'profile') {
      case 'address':
        return (
          <AddressSection
            addresses={addresses}
            onAdd={handleAddAddress}
            onUpdate={handleUpdateAddress}
            onDelete={handleDeleteAddress}
          />
        )
      case 'payment':
        return <PaymentMethodSection selectedId={paymentMethodId} onSelect={setPaymentMethodId} />
      case 'bookings':
        return <BookingsSection bookings={mockBookings} />
      case 'support':
        return <SupportSection />
      case 'about':
        return <AboutSection />
      case 'privacy':
        return <PrivacySection />
      case 'settings':
        return <SettingsSection preferences={notifications} onToggle={handleToggleNotification} />
      case 'profile':
      default:
        return <ProfileOverviewSection user={user} onEditClick={() => setEditModalOpen(true)} />
    }
  }

  return (
    <div className="dashboard">
      {/* Sidebar on desktop (always visible); the mobile "list" view
          otherwise — hidden on mobile only once a section is selected, via
          the is-hidden-on-mobile class below (see UserDashboard.css). */}
      <div className={`dashboard__sidebar${activeSection ? ' is-hidden-on-mobile' : ''}`}>
        <ProfileHeader user={user} onEditClick={() => setEditModalOpen(true)} />
        <DashboardMenu activeSection={activeSection} onSelect={setActiveSection} paymentSubtitle={paymentSubtitle} />
      </div>

      {/* Content panel on desktop (always visible, defaults to My Profile);
          the mobile "detail" view otherwise — only visible once a section
          is selected. */}
      <div className={`dashboard__content${!activeSection ? ' is-hidden-on-mobile' : ''}`}>
        <div className="dashboard__content-header">
          <button
            type="button"
            className="dashboard__back"
            onClick={() => setActiveSection(null)}
            aria-label="Back to account menu"
          >
            <ChevronLeftIcon /> Back
          </button>
          <h2 className="dashboard__content-title">{activeSectionLabel}</h2>
        </div>
        <div className="dashboard__content-body">{renderContent()}</div>
      </div>

      <EditProfileModal
        open={editModalOpen}
        user={user}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  )
}
