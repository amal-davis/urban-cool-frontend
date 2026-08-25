import { services } from '../../data/services'
import { ServiceCard } from './ServiceCard'
import './BookServiceSection.css'

export function BookServiceSection() {
  return (
    <section className="book-service" aria-labelledby="book-service-heading">
      <div className="container">
        <h2 id="book-service-heading" className="book-service__heading">
          Book a Service
        </h2>
        <div className="book-service__grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
