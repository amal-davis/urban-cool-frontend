import { services } from '../data/services'
import { ServiceDetail } from '../components/Services/ServiceDetail'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { GridIcon } from '../components/icons/Icons'
import { WhyChooseUs } from '../components/WhyChooseUs/WhyChooseUs'
import { ServiceAvailability } from '../components/ServiceAvailability/ServiceAvailability'
import { FinalCTA } from '../components/FinalCTA/FinalCTA'
import { Reveal } from '../components/Reveal/Reveal'
import { usePageMeta } from '../lib/usePageMeta'
import './ServicesPage.css'

// Renders in this order (AC, Refrigerator, Washing Machine, Microwave)
// regardless of `services`' own array order (ac, washing-machine,
// microwave, refrigerator — the order the homepage's Book a Service cards
// already rely on and shouldn't be reshuffled for).
const SERVICE_ORDER = ['ac', 'refrigerator', 'washing-machine', 'microwave']

export function ServicesPage() {
  usePageMeta(
    'Services | Urban Cool',
    'Explore Urban Cool appliance repair and service solutions for AC, refrigerators, washing machines and microwaves in Kochi.',
  )

  const orderedServices = SERVICE_ORDER.map((id) => services.find((service) => service.id === id)!)

  return (
    <>
      {/* Not wrapped in Reveal: above the fold on every load, same reasoning
          as HomePage's hero. */}
      <PageHeader
        icon={GridIcon}
        heading="Our Services"
        description="Reliable appliance repair and service solutions for your home."
      />

      {/* One section, one card per service — image, description, what we
          help with, and the booking CTA all together. Previously this was
          split into a compact summary card here plus a separate detailed
          block further down the page; that duplicated every service and
          needed a "View Details" jump between the two. Merged into one. */}
      <section className="services-overview" aria-labelledby="services-overview-heading">
        <div className="container">
          <div className="services-overview__intro">
            <h2 id="services-overview-heading" className="services-overview__heading">
              Explore Our Services
            </h2>
            <p className="services-overview__description">
              Choose the appliance service you need and book professional assistance with Urban Cool.
            </p>
          </div>

          <div className="services-overview__list">
            {/* Each card reveals individually as it's scrolled to, rather
                than the whole stack fading in at once — a real stagger,
                not four identical entrances landing together. */}
            {orderedServices.map((service, index) => (
              <Reveal key={service.id}>
                <ServiceDetail service={service} reverse={index % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal>
        <WhyChooseUs />
      </Reveal>
      <Reveal>
        <ServiceAvailability />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
    </>
  )
}
