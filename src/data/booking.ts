import { mockUser } from './dashboardData'
import type { Service } from './services'

export interface BookingCustomerDetails {
  fullName: string
  email: string
  /** Local 10-digit number — read-only in the booking form, never
   *  re-collected. Sourced from the same mock "signed in user" the Personal
   *  Dashboard already uses (see mockUser below): this project has no real
   *  auth/session state on the frontend yet (OTP login only sets a backend
   *  session cookie — see lib/authApi.ts — there's no React context reading
   *  it back), so mockUser is the established stand-in everywhere a
   *  "current user" is needed until that exists. */
  phone: string
}

export interface BookingAddress {
  houseNumber: string
  street: string
  city: string
  state: string
  pincode: string
}

export interface BookingLocation {
  latitude: number | null
  longitude: number | null
  /** Reverse-geocoded formatted address, when Google's Geocoder is loaded
   *  and succeeds. Purely informational — display only, never a substitute
   *  for the structured `BookingAddress` fields, and never required. */
  address: string | null
}

export interface BookingImageFile {
  id: string
  file: File
  /** Local object URL for the preview thumbnail — never sent anywhere; see
   *  ImageUploader.tsx for why these get revoked on removal/unmount. */
  previewUrl: string
}

/** Everything the booking page collects, shaped so it can go straight into
 *  a POST body once a real booking API exists (see BookingPage.tsx's
 *  handleConfirm) — `images` is the one field that can't travel as JSON
 *  as-is (it'd become a multipart FormData entry per file instead), every
 *  other field is already primitive/serializable. */
export interface BookingFormValues {
  serviceId: string
  customer: BookingCustomerDetails
  address: BookingAddress
  location: BookingLocation
  complaint: string
  images: BookingImageFile[]
}

/** Name/Email/Mobile prefill from the mock signed-in user — see the
 *  `phone` field's own comment above for why. Address/location/complaint/
 *  images always start blank; there's nothing to reasonably prefill them
 *  from. */
export function createInitialBookingFormValues(service: Service): BookingFormValues {
  return {
    serviceId: service.id,
    customer: {
      fullName: mockUser.fullName,
      email: mockUser.email,
      phone: mockUser.phone,
    },
    address: { houseNumber: '', street: '', city: '', state: '', pincode: '' },
    location: { latitude: null, longitude: null, address: null },
    complaint: '',
    images: [],
  }
}

/** States/UTs for the Service Address "State" field — a fixed select per
 *  the brief, not free text. */
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]
