import { PRICE_DISCLAIMER } from '../../data/services'

interface EstimatedPriceProps {
  startingPrice: number
  priceLabel?: string
}

/**
 * Starting-price block. Deliberately never says "Price:" or shows the
 * number alone — "Starting From" + the disclaimer below it make it
 * unambiguous this is an estimate, not a final quote (the real cost is
 * only ever confirmed by the booking/service flow). See PRICE_DISCLAIMER
 * in data/services.ts — shared wording, not re-typed per service.
 */
export function EstimatedPrice({ startingPrice, priceLabel = 'Starting From' }: EstimatedPriceProps) {
  return (
    <div className="service-detail__price">
      <span className="service-detail__price-label">{priceLabel}</span>
      <span className="service-detail__price-value">₹{startingPrice}</span>
      <p className="service-detail__price-disclaimer">{PRICE_DISCLAIMER}</p>
    </div>
  )
}
