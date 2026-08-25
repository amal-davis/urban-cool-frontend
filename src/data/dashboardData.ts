/**
 * Frontend-only mock data for the Personal Dashboard (UserDashboard and its
 * sections). Everything here is realistic placeholder content, not a real
 * account — the shapes below are deliberately what a real API response
 * would look like, so wiring up the backend later means replacing how this
 * data is *sourced* (a `useState(mockUser)` becoming a `useQuery`/`fetch`
 * effect in UserDashboard.tsx), not how it's *shaped* or *consumed* by any
 * of the section components. No component below reads from this file
 * directly except UserDashboard, which owns and passes all of it down —
 * see that file's own comment for why.
 */

export interface DashboardUser {
  id: string
  fullName: string
  /** Local 10-digit Indian mobile number — same shape indianPhone.ts's
   *  helpers already expect, so formatGroupedIndianMobile/toE164 keep
   *  working unchanged once this comes from a real verified-login session. */
  phone: string
  email: string
  /** null = no photo on file yet; ProfileHeader/Avatar renders initials
   *  instead. Never a placeholder stock-photo URL — a fabricated photo
   *  would misrepresent a specific person more than initials ever could. */
  avatarUrl: string | null
  memberSince: string
}

export const mockUser: DashboardUser = {
  id: 'user-mock-1',
  fullName: 'Amal K S',
  phone: '9072123456',
  email: 'amal.ks@example.com',
  avatarUrl: null,
  memberSince: 'March 2025',
}

export interface Address {
  id: string
  /** "Home" / "Work" / a custom label the user typed. */
  label: string
  recipientName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export const mockAddresses: Address[] = [
  {
    id: 'addr-home',
    label: 'Home',
    recipientName: 'Amal K S',
    line1: 'Sunrise Residency, Door No. 24',
    line2: 'Palarivattom',
    city: 'Kochi',
    state: 'Kerala',
    postalCode: '682001',
    country: 'India',
    isDefault: true,
  },
]

export type PaymentMethodId = 'cash' | 'upi' | 'card'

export interface PaymentMethodOption {
  id: PaymentMethodId
  label: string
  description: string
}

export const paymentMethodOptions: PaymentMethodOption[] = [
  {
    id: 'cash',
    label: 'Cash on Service',
    description: 'Pay the technician directly once the service is complete.',
  },
  {
    id: 'upi',
    label: 'UPI',
    description: 'Pay instantly with any UPI app — Google Pay, PhonePe, Paytm.',
  },
  {
    id: 'card',
    label: 'Card',
    description: 'Pay securely with a debit or credit card.',
  },
]

export const DEFAULT_PAYMENT_METHOD_ID: PaymentMethodId = 'cash'

export type BookingStatus = 'upcoming' | 'in-progress' | 'completed' | 'cancelled'

export const bookingStatusLabels: Record<BookingStatus, string> = {
  upcoming: 'Upcoming',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export interface Booking {
  id: string
  bookingRef: string
  /** Matches an id in data/services.ts — lets a card render that service's
   *  real icon instead of a generic placeholder. */
  serviceId: string
  serviceName: string
  date: string
  timeSlot: string
  address: string
  status: BookingStatus
  /** Whole rupees — INR has no minor unit in everyday pricing display here. */
  price: number
}

// Dates sit around "today" (22 Aug 2026) on purpose — a mix of one real
// future booking, one currently underway, and past completed/cancelled ones,
// so every status in bookingStatusLabels has at least one realistic example.
export const mockBookings: Booking[] = [
  {
    id: 'bk-1',
    bookingRef: 'UC-10234',
    serviceId: 'ac',
    serviceName: 'AC Service',
    date: '25 August 2026',
    timeSlot: '10:00 AM - 12:00 PM',
    address: 'Sunrise Residency, Palarivattom, Kochi',
    status: 'upcoming',
    price: 499,
  },
  {
    id: 'bk-2',
    bookingRef: 'UC-10198',
    serviceId: 'refrigerator',
    serviceName: 'Refrigerator Repair',
    date: '22 August 2026',
    timeSlot: '02:00 PM - 04:00 PM',
    address: 'Sunrise Residency, Palarivattom, Kochi',
    status: 'in-progress',
    price: 649,
  },
  {
    id: 'bk-3',
    bookingRef: 'UC-10143',
    serviceId: 'washing-machine',
    serviceName: 'Washing Machine Service',
    date: '10 August 2026',
    timeSlot: '11:00 AM - 01:00 PM',
    address: 'Sunrise Residency, Palarivattom, Kochi',
    status: 'completed',
    price: 549,
  },
  {
    id: 'bk-4',
    bookingRef: 'UC-10099',
    serviceId: 'microwave',
    serviceName: 'Microwave Repair',
    date: '2 August 2026',
    timeSlot: '09:00 AM - 11:00 AM',
    address: 'Sunrise Residency, Palarivattom, Kochi',
    status: 'completed',
    price: 349,
  },
  {
    id: 'bk-5',
    bookingRef: 'UC-10061',
    serviceId: 'ac',
    serviceName: 'AC Service',
    date: '28 July 2026',
    timeSlot: '03:00 PM - 05:00 PM',
    address: 'Sunrise Residency, Palarivattom, Kochi',
    status: 'cancelled',
    price: 499,
  },
]

export interface NotificationPreferences {
  bookingReminders: boolean
  serviceUpdates: boolean
  promotionalOffers: boolean
}

export const mockNotificationPreferences: NotificationPreferences = {
  bookingReminders: true,
  serviceUpdates: true,
  promotionalOffers: false,
}

export interface FaqEntry {
  question: string
  answer: string
}

export const supportFaqs: FaqEntry[] = [
  {
    question: 'How do I book a service?',
    answer:
      'Go to Services, pick your appliance, and choose a slot — you’ll get a booking confirmation with a Booking ID right away.',
  },
  {
    question: 'Can I reschedule or cancel a booking?',
    answer:
      'Yes — open the booking under My Bookings and use the reschedule or cancel option. Upcoming bookings can be changed until the technician is dispatched.',
  },
  {
    question: 'How do I sign in without a password?',
    answer:
      'Urban Cool uses OTP-based sign-in — enter your mobile number and verify the one-time code sent to it. No password to remember.',
  },
  {
    question: 'What payment methods are supported?',
    answer: 'Cash on Service, UPI, and Card — set your preferred option under Payment Method.',
  },
]
