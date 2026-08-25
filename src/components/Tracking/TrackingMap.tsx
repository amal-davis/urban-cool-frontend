import { useEffect, useRef, useState } from 'react'
import { isGoogleMapsConfigured, loadGoogleMaps } from '../../lib/googleMaps'
import type { TrackingLocation } from '../../data/tracking'
import '../Booking/BookingPage.css'

interface TrackingMapProps {
  customerLocation: TrackingLocation
  /** null = nothing to plot for the technician yet (no technician assigned,
   *  or the job is no longer live) — only the customer marker renders. */
  technicianLocation: TrackingLocation | null
  /** Whether to draw the technician -> customer line. Decided by the
   *  caller (ON_THE_WAY only — see ServiceTrackingPage), not by this
   *  component, so TrackingMap stays a pure "draw what I'm given"
   *  presentational piece with no booking-status logic of its own. */
  showRoute: boolean
}

type MapStatus = 'idle' | 'loading' | 'ready' | 'unavailable'

const CUSTOMER_MARKER_COLOR = '#0186dc' // --color-primary
const TECHNICIAN_MARKER_COLOR = '#bf052e' // --color-accent
const ROUTE_COLOR = '#0059ae' // --color-primary-deep

/**
 * Read-only tracking map — customer marker always, technician marker when
 * `technicianLocation` is provided, a straight demonstration line between
 * them when `showRoute` is true. This is NOT a real Directions/Roads API
 * route (none is configured — see the comment on ROUTE_COLOR's Polyline
 * below); it's an honest straight-line indicator of direction only, never
 * presented as an actual driving route or the technician's real live
 * position.
 *
 * Deliberately reactive to props, not just initialized once: the effect
 * that places markers/route re-runs whenever `customerLocation` /
 * `technicianLocation` / `showRoute` change, which is exactly the seam a
 * future WebSocket/polling update would use — swap this component's mock
 * `technicianLocation` prop for one driven by `useState` + a live event
 * subscription in the parent, and this component needs no changes at all
 * (see ServiceTrackingPage.tsx's own comment on this).
 *
 * Same load/fallback pattern as LocationPicker.tsx (reuses its CSS via
 * BookingPage.css rather than a second copy) — no key configured -> the
 * "unable to load" panel, script failure -> same panel, never a blank map
 * or a crashed page.
 */
export function TrackingMap({ customerLocation, technicianLocation, showRoute }: TrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const customerMarkerRef = useRef<google.maps.Marker | null>(null)
  const technicianMarkerRef = useRef<google.maps.Marker | null>(null)
  const routeRef = useRef<google.maps.Polyline | null>(null)

  const [mapStatus, setMapStatus] = useState<MapStatus>('idle')

  // Mount-only: create the Map instance exactly once. Marker/route
  // placement is a separate effect below, keyed on the location props, so
  // it can re-run on every update without re-creating the map itself.
  useEffect(() => {
    if (!isGoogleMapsConfigured()) {
      setMapStatus('unavailable')
      return
    }

    let cancelled = false
    setMapStatus('loading')

    loadGoogleMaps()
      .then(({ maps }) => {
        if (cancelled || !mapContainerRef.current) return
        mapRef.current = new maps.Map(mapContainerRef.current, {
          center: customerLocation,
          zoom: 13,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        })
        setMapStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setMapStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
    // Runs once — see LocationPicker.tsx's identical reasoning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Places/updates/removes markers and the route line whenever the map is
  // ready or the location props change.
  useEffect(() => {
    const map = mapRef.current
    if (mapStatus !== 'ready' || !map || !window.google?.maps) return
    const { maps } = window.google

    if (customerMarkerRef.current) {
      customerMarkerRef.current.setPosition(customerLocation)
    } else {
      customerMarkerRef.current = new maps.Marker({
        position: customerLocation,
        map,
        title: 'Customer location',
        label: { text: 'C', color: '#fff', fontWeight: '700' },
        icon: { path: maps.SymbolPath.CIRCLE, scale: 10, fillColor: CUSTOMER_MARKER_COLOR, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
        zIndex: 1,
      })
    }

    if (technicianLocation) {
      if (technicianMarkerRef.current) {
        technicianMarkerRef.current.setPosition(technicianLocation)
      } else {
        technicianMarkerRef.current = new maps.Marker({
          position: technicianLocation,
          map,
          title: 'Technician location',
          label: { text: 'T', color: '#fff', fontWeight: '700' },
          icon: { path: maps.SymbolPath.CIRCLE, scale: 10, fillColor: TECHNICIAN_MARKER_COLOR, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
          zIndex: 2,
        })
      }
    } else if (technicianMarkerRef.current) {
      technicianMarkerRef.current.setMap(null)
      technicianMarkerRef.current = null
    }

    if (showRoute && technicianLocation) {
      const path = [technicianLocation, customerLocation]
      if (routeRef.current) {
        routeRef.current.setMap(null)
      }
      // A straight demonstration line, not a real route — see this
      // component's top comment.
      routeRef.current = new maps.Polyline({
        path,
        map,
        strokeColor: ROUTE_COLOR,
        strokeOpacity: 0,
        strokeWeight: 3,
        geodesic: true,
        icons: [{ icon: { path: maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: ROUTE_COLOR }, offset: '0', repeat: '18px' }],
      })
    } else if (routeRef.current) {
      routeRef.current.setMap(null)
      routeRef.current = null
    }

    const bounds = new maps.LatLngBounds()
    bounds.extend(customerLocation)
    if (technicianLocation) bounds.extend(technicianLocation)
    map.fitBounds(bounds, 56)
  }, [mapStatus, customerLocation, technicianLocation, showRoute])

  const label = technicianLocation
    ? 'Map showing your technician and service location'
    : 'Map showing your service location'

  return (
    <div className="location-picker">
      <div ref={mapContainerRef} className="location-picker__map" role="group" aria-label={label} />

      {mapStatus === 'loading' && (
        <div className="location-picker__overlay" role="status">
          Loading map…
        </div>
      )}

      {mapStatus === 'unavailable' && (
        <div className="location-picker__overlay location-picker__overlay--muted" role="status">
          <p>Unable to load the map.</p>
          <p>You can still reach your technician using the call or chat options below.</p>
        </div>
      )}
    </div>
  )
}
