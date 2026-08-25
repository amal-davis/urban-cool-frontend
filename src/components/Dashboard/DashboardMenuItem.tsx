import type { ComponentType, SVGProps } from 'react'
import { ChevronRightIcon } from '../icons/Icons'
import './DashboardMenuItem.css'

interface DashboardMenuItemProps {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  /** Payment Method's "Cash on Service" line — the only row that carries
   *  one, and it's computed by the caller from live state, not hardcoded. */
  subtitle?: string
  /** Highlighted + aria-current — only meaningful on desktop, where the
   *  row and its content panel are visible at the same time; harmless
   *  (just never visually distinct) on mobile, where selecting a row
   *  immediately navigates away from the list. */
  active?: boolean
  onClick: () => void
}

/** One row of the dashboard menu — reused by DashboardMenu for every
 *  section (My Address, Payment Method, ...). Deliberately a <button>, not
 *  an <a>/NavLink: these aren't distinct URLs, they're an in-page section
 *  switch (see UserDashboard.tsx's activeSection state). */
export function DashboardMenuItem({ Icon, label, subtitle, active, onClick }: DashboardMenuItemProps) {
  return (
    <button
      type="button"
      className={`dashboard-menu-item${active ? ' is-active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
    >
      <span className="dashboard-menu-item__icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="dashboard-menu-item__text">
        <span className="dashboard-menu-item__label">{label}</span>
        {subtitle && <span className="dashboard-menu-item__subtitle">{subtitle}</span>}
      </span>
      <ChevronRightIcon className="dashboard-menu-item__chevron" />
    </button>
  )
}
