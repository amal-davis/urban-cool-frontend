/**
 * No verified Urban Cool address, phone number, or email exists anywhere in
 * this project — checked PRODUCT.md, DESIGN.md, the Django backend, and the
 * rest of the repo before writing this file. Everything below is a clearly
 * marked placeholder, not a real value. Replace it here once the real
 * details exist; every place that shows contact info (ContactInfo, Footer)
 * reads from this one file, so updating it updates the whole site.
 *
 * `phoneHref`/`emailHref` stay `null` until real values exist — a `tel:`/
 * `mailto:` link built from placeholder text would just be broken, so the
 * components render plain (non-clickable) text instead while these are null.
 */
export const businessInfo = {
  addressDisplay: '[Urban Cool Address — Kochi, Kerala]',

  phoneDisplay: '[Urban Cool Phone Number]',
  /** e.g. 'tel:+914812345678' once a real number exists. */
  phoneHref: null as string | null,

  emailDisplay: '[Urban Cool Email Address]',
  /** e.g. 'mailto:hello@urbancool.example' once a real address exists. */
  emailHref: null as string | null,

  serviceArea: 'Kochi, Kerala',

  /** City-level only — no exact business address to place a precise pin at
   *  yet. Update to the real street address once it's available; every
   *  place that embeds the map (MapEmbed) reads from this. */
  mapQuery: 'Kochi, Kerala',
}
