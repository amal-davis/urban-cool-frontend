import type { ComponentType, SVGProps } from 'react'
import { CalendarIcon, GridIcon, HomeIcon, TechnicianIcon } from '../components/icons/Icons'

export interface Highlight {
  id: string
  title: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

// Deliberately reuses the same icon vocabulary as features.ts/steps.ts
// rather than introducing new ones — this section reinforces the same
// points made in "Why Choose Us", it isn't new information.
export const highlights: Highlight[] = [
  { id: 'professional', title: 'Professional Service', Icon: TechnicianIcon },
  { id: 'doorstep', title: 'Doorstep Convenience', Icon: HomeIcon },
  { id: 'easy-booking', title: 'Easy Booking', Icon: CalendarIcon },
  { id: 'multiple-categories', title: 'Multiple Appliance Categories', Icon: GridIcon },
]
