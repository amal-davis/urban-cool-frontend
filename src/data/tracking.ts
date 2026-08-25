import technicianSreekanth from '../assets/photos/technician-sreekanth.jpg'
import technicianArun from '../assets/photos/technician-arun.jpg'
import technicianDivya from '../assets/photos/technician-divya.jpg'

/**
 * Frontend-only mock data for the Service Tracking page — same "shape a
 * real API response would already have" approach as dashboardData.ts (see
 * that file's own top comment). Booking summary fields (service, date,
 * time, address, price) are NOT duplicated here — ServiceTrackingPage joins
 * this file's tracking overlay to dashboardData.ts's existing `mockBookings`
 * by booking id, the same id space BookingCard already renders
 * ("Booking ID: UC-10234" etc).
 */

export type TrackingStatus = 'BOOKED' | 'ASSIGNED' | 'ON_THE_WAY' | 'COMPLETED'

export interface TrackingStatusStep {
  id: TrackingStatus
  label: string
}

/** Drives StatusTimeline's steps/progress-line and the current-status
 *  message below it — never hardcoded per status in JSX (see
 *  StatusTimeline.tsx/CurrentStatusMessage.tsx). */
export const TRACKING_STATUS_STEPS: TrackingStatusStep[] = [
  { id: 'BOOKED', label: 'Booked' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'ON_THE_WAY', label: 'On The Way' },
  { id: 'COMPLETED', label: 'Completed' },
]

export const TRACKING_STATUS_MESSAGES: Record<TrackingStatus, string> = {
  BOOKED: 'Your service request has been booked.',
  ASSIGNED: 'A technician has been assigned to your service.',
  ON_THE_WAY: 'Your technician is on the way.',
  COMPLETED: 'Your service has been completed.',
}

export interface TrackingTechnician {
  name: string
  /** Stock photos standing in for real technician photos (see
   *  assets/photos/CREDITS.md — none of these are actual Urban Cool staff).
   *  Still optional: TechnicianCard falls back to an initials avatar
   *  whenever this is unset, which is exactly what happens once real
   *  technician records without a photo on file come from a backend. */
  image?: string
  rating: number
  reviewCount: number
  /** Local 10-digit Indian mobile number — same shape indianPhone.ts's
   *  helpers already expect (see mockUser.phone in dashboardData.ts). */
  phone: string
}

export interface TrackingLocation {
  lat: number
  lng: number
  address?: string
}

export interface TrackingDetails {
  status: TrackingStatus
  /** null = not assigned yet (BOOKED only) — TechnicianSection shows the
   *  "will be assigned shortly" pending state instead of a card, never a
   *  fabricated technician. */
  technician: TrackingTechnician | null
  customerLocation: TrackingLocation
  /** null when there's nothing meaningful to plot yet (BOOKED) or the job
   *  is no longer live (COMPLETED) — see TrackingMap's own handling. */
  technicianLocation: TrackingLocation | null
}

// Kochi-area coordinates for demonstration only — not the visitor's real
// location (never requested here; see LocationTrackingMap) and not any
// technician's real position. Picked to sit a few km apart so the
// ON_THE_WAY route reads clearly on the map.
const CUSTOMER_LOCATION: TrackingLocation = { lat: 9.9312, lng: 76.2673, address: 'Sunrise Residency, Palarivattom, Kochi' }
const TECHNICIAN_DEPOT_LOCATION: TrackingLocation = { lat: 9.9816, lng: 76.2999 } // Kakkanad — technician's starting point
const TECHNICIAN_EN_ROUTE_LOCATION: TrackingLocation = { lat: 9.9503, lng: 76.2825 } // partway to the customer

/**
 * Keyed by the same booking ids `mockBookings` (dashboardData.ts) already
 * uses. Chosen independently of each booking's own dashboard-list status
 * label (upcoming/in-progress/completed/cancelled is a coarser, separate
 * vocabulary — see StatusBadge) specifically so each of the four tracking
 * statuses has exactly one clean, ready-to-test example here — bk-5
 * (cancelled) is intentionally omitted; a cancelled booking has nothing to
 * track. A real backend would be the single source of truth for both.
 */
export const trackingDetailsByBookingId: Record<string, TrackingDetails> = {
  'bk-1': {
    status: 'BOOKED',
    technician: null,
    customerLocation: CUSTOMER_LOCATION,
    technicianLocation: null,
  },
  'bk-2': {
    status: 'ASSIGNED',
    technician: { name: 'Arun Kumar', image: technicianArun, rating: 4.7, reviewCount: 98, phone: '9876500001' },
    customerLocation: CUSTOMER_LOCATION,
    technicianLocation: TECHNICIAN_DEPOT_LOCATION,
  },
  'bk-3': {
    status: 'ON_THE_WAY',
    technician: { name: 'Sreekanth', image: technicianSreekanth, rating: 4.8, reviewCount: 120, phone: '9876500002' },
    customerLocation: CUSTOMER_LOCATION,
    technicianLocation: TECHNICIAN_EN_ROUTE_LOCATION,
  },
  'bk-4': {
    status: 'COMPLETED',
    technician: { name: 'Divya Menon', image: technicianDivya, rating: 4.9, reviewCount: 210, phone: '9876500003' },
    customerLocation: CUSTOMER_LOCATION,
    technicianLocation: null,
  },
}

export function getTrackingDetails(bookingId: string): TrackingDetails | undefined {
  return trackingDetailsByBookingId[bookingId]
}

// --- Chat (frontend-only — see components/Tracking/ChatModal.tsx) ---

export interface ChatMessage {
  id: string
  sender: 'technician' | 'customer'
  text: string
  /** Pre-formatted for display, not a Date — this is static seed data, not
   *  something a real-time clock needs to stay in sync with. */
  time: string
}

/** A realistic opening exchange, seeded fresh whenever ChatModal mounts.
 *  Frontend state only — no chat backend/WebSocket exists yet (see
 *  ChatModal's own comment on how one would plug in). Returns a fresh array
 *  each call (never a shared mutable module-level array) so ChatModal's own
 *  `useState` can own and append to its copy freely. */
export function createSeedChatMessages(): ChatMessage[] {
  return [
    { id: 'seed-1', sender: 'technician', text: "I'm on my way. I'll reach you shortly.", time: '10:02 AM' },
    { id: 'seed-2', sender: 'customer', text: 'Okay, thank you.', time: '10:03 AM' },
  ]
}
