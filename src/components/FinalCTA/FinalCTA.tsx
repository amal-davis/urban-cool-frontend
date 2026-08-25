import { Link } from 'react-router-dom'
import './FinalCTA.css'

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container final-cta__inner">
        <h2 className="final-cta__heading">Need Appliance Service?</h2>
        <p className="final-cta__description">Book your appliance service with Urban Cool today.</p>

        <div className="final-cta__actions">
          {/* TODO: wire to the real booking flow once it exists — same
              "Coming soon" pattern used across the site. */}
          <button type="button" className="btn btn--accent" title="Coming soon">
            Book a Service
          </button>
          <Link to="/contact" className="btn btn--ghost final-cta__secondary">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
