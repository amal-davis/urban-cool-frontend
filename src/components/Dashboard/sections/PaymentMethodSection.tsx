import { CheckCircleIcon } from '../../icons/Icons'
import { paymentMethodOptions } from '../../../data/dashboardData'
import type { PaymentMethodId } from '../../../data/dashboardData'
import './PaymentMethodSection.css'
import './SectionCard.css'

interface PaymentMethodSectionProps {
  selectedId: PaymentMethodId
  onSelect: (id: PaymentMethodId) => void
}

/**
 * Payment Method preferences — UI/frontend state only, no payment
 * processing or gateway of any kind. Selecting an option here updates
 * UserDashboard's paymentMethodId state directly, which is also what
 * drives the "Cash on Service" subtitle on the menu row (see
 * DashboardMenu.tsx) — one source of truth, no separate copy to sync.
 */
export function PaymentMethodSection({ selectedId, onSelect }: PaymentMethodSectionProps) {
  return (
    <div className="section-card">
      <h3 className="section-heading">Preferred Payment Method</h3>
      <div className="payment-options" role="radiogroup" aria-label="Preferred payment method">
        {paymentMethodOptions.map((option) => {
          const isSelected = option.id === selectedId
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`payment-option${isSelected ? ' is-selected' : ''}`}
              onClick={() => onSelect(option.id)}
            >
              <span className="payment-option__text">
                <span className="payment-option__label">{option.label}</span>
                <span className="payment-option__description">{option.description}</span>
              </span>
              <span className="payment-option__indicator" aria-hidden="true">
                {isSelected && <CheckCircleIcon />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
