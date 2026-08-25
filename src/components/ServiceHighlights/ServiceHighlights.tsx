import { highlights } from '../../data/highlights'
import './ServiceHighlights.css'

export function ServiceHighlights() {
  return (
    <section className="service-highlights" aria-labelledby="service-highlights-heading">
      <div className="container">
        <h2 id="service-highlights-heading" className="service-highlights__heading">
          Service You Can Trust
        </h2>

        <ul className="service-highlights__list">
          {highlights.map(({ id, title, Icon }) => (
            <li key={id} className="highlight">
              <span className="highlight__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="highlight__title">{title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
