import heroAc from '../assets/photos/hero-ac.webp'
import heroRefrigerator from '../assets/photos/hero-refrigerator.webp'
import heroWashingMachine from '../assets/photos/hero-washing-machine.webp'
import heroMicrowave from '../assets/photos/hero-microwave.webp'

export interface HeroSlide {
  id: string
  /** Short heading only — no supporting paragraph. Kept to roughly this
   *  length (~27-29 characters) on purpose: at hero-scale display type this
   *  wraps to at most two lines even on a 320px phone, never three or four
   *  (see HeroCarousel.css's `max-width: ch` clamps on `.hero-slide__heading`). */
  heading: string
  /** Visible button text — literally "Book Now" for every slide, matching
   *  the rest of the site's "Book Now" CTAs (ServiceDetailPage, BookingCTA).
   *  `ctaAriaLabel` carries the per-service context instead, same
   *  compact-label/fuller-aria-label split `data/services.ts`'s `name`/
   *  `ariaLabel` pair already uses. */
  ctaLabel: string
  ctaAriaLabel: string
  /** Product image (imported asset URL) — isolated appliance renders on a
   *  transparent/white background, provided directly rather than sourced
   *  stock photography (unlike the other files under assets/photos/, these
   *  aren't tracked in CREDITS.md). */
  image: string
  imageAlt: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'ac',
    heading: 'AC Service at Your Doorstep',
    ctaLabel: 'Book Now',
    ctaAriaLabel: 'Book AC Service',
    image: heroAc,
    imageAlt: 'An AC indoor and outdoor unit',
  },
  {
    id: 'refrigerator',
    heading: 'Expert Refrigerator Service',
    ctaLabel: 'Book Now',
    ctaAriaLabel: 'Book Refrigerator Service',
    image: heroRefrigerator,
    imageAlt: 'A refrigerator',
  },
  {
    id: 'washing-machine',
    heading: 'Fast Washing Machine Service',
    ctaLabel: 'Book Now',
    ctaAriaLabel: 'Book Washing Machine Service',
    image: heroWashingMachine,
    imageAlt: 'A front-load washing machine',
  },
  {
    id: 'microwave',
    heading: 'Reliable Microwave Service',
    ctaLabel: 'Book Now',
    ctaAriaLabel: 'Book Microwave Service',
    image: heroMicrowave,
    imageAlt: 'A microwave oven with the door open',
  },
]
