import { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface CoordinatesModalProps {
    isOpen: boolean
    onClose: () => void
    planetName: string
    latitude: number
    longitude: number
    description?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    return haversineDistance(lat1, lon1, lat2, lon2) * 1000
}

function formatDistance(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.round((seconds % 3600) / 60)
    return h === 0 ? `${m} min` : `${h}h ${m}min`
}

function makeSvgIcon(html: string, size: [number, number], anchor: [number, number]) {
    return L.divIcon({ html, iconSize: size, iconAnchor: anchor, className: '' })
}

const TARGET_ICON = makeSvgIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40" width="32" height="40">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 7 12 26 12 26s12-19 12-26C24 5.37 18.63 0 12 0z" fill="#29657a"/>
        <circle cx="12" cy="12" r="5" fill="#A0DAF1"/>
    </svg>`,
    [32, 40], [16, 40],
)

const USER_ICON = makeSvgIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
        <circle cx="14" cy="14" r="13" fill="rgba(100,200,120,0.15)" stroke="#4ade80" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="6" fill="#4ade80"/>
        <circle cx="14" cy="14" r="3" fill="#fff"/>
    </svg>`,
    [28, 28], [14, 14],
)

const ROUTE_REFETCH_THRESHOLD_M = 50

type GeoState = 'idle' | 'loading' | 'success' | 'error'
type RouteState = 'idle' | 'loading' | 'success' | 'error'

// ── Component ─────────────────────────────────────────────────────────────────

export default function CoordinatesModal({
    isOpen,
    onClose,
    planetName,
    latitude,
    longitude,
    description = 'Coordinates',
}: CoordinatesModalProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)
    const userMarkerRef = useRef<L.Marker | null>(null)
    const routeHaloRef = useRef<L.GeoJSON | null>(null)
    const routeLineRef = useRef<L.GeoJSON | null>(null)
    const watchIdRef = useRef<number | null>(null)
    const lastRouteFetchRef = useRef<{ lat: number; lng: number } | null>(null)
    const hasFittedRef = useRef(false)

    const [geoState, setGeoState] = useState<GeoState>('idle')
    const [geoError, setGeoError] = useState<string | null>(null)
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
    const [straightDist, setStraightDist] = useState<string | null>(null)

    const [routeState, setRouteState] = useState<RouteState>('idle')
    const [routeDistance, setRouteDistance] = useState<string | null>(null)
    const [routeDuration, setRouteDuration] = useState<string | null>(null)

    // ── 1. Map init ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (isOpen && mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map)

            L.marker([latitude, longitude], { icon: TARGET_ICON })
                .addTo(map)
                .bindPopup(
                    `<div style="text-align:center;font-weight:bold;color:#29657a;">
                        ${planetName}<br/>${description}<br/>
                        ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                    </div>`
                )

            mapRef.current = map
            setTimeout(() => map.invalidateSize(), 100)
        }

        return () => {
            if (!isOpen && mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
                userMarkerRef.current = null
                routeHaloRef.current = null
                routeLineRef.current = null
                hasFittedRef.current = false
            }
        }
    }, [isOpen, latitude, longitude, planetName, description])

    // ── 2. Route fetcher (stable ref via useCallback) ─────────────────────────
    const fetchRoute = useCallback(async (uLat: number, uLng: number) => {
        const map = mapRef.current
        if (!map) return

        setRouteState('loading')
        try {
            const url =
                `https://router.project-osrm.org/route/v1/driving/` +
                `${uLng},${uLat};${longitude},${latitude}` +
                `?overview=full&geometries=geojson`

            const res = await fetch(url)
            const data = await res.json()

            if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route.')

            const route = data.routes[0]
            setRouteDistance(formatDistance(route.distance / 1000))
            setRouteDuration(formatDuration(route.duration))
            setRouteState('success')
            lastRouteFetchRef.current = { lat: uLat, lng: uLng }

            routeHaloRef.current?.remove()
            routeLineRef.current?.remove()

            routeHaloRef.current = L.geoJSON(route.geometry, {
                style: { color: '#000', weight: 7, opacity: 0.18 },
            }).addTo(map)

            routeLineRef.current = L.geoJSON(route.geometry, {
                style: { color: '#4ade80', weight: 4, opacity: 0.85 },
            }).addTo(map)

            if (!hasFittedRef.current) {
                map.fitBounds(routeLineRef.current.getBounds(), { padding: [48, 48] })
                hasFittedRef.current = true
            }
        } catch {
            setRouteState('error')
            routeHaloRef.current?.remove()
            routeLineRef.current?.remove()
            routeLineRef.current = L.geoJSON(
                {
                    type: 'LineString',
                    coordinates: [[uLng, uLat], [longitude, latitude]],
                } as GeoJSON.Geometry,
                { style: { color: '#4ade80', weight: 1.5, opacity: 0.5, dashArray: '6 6' } }
            ).addTo(map)
        }
    }, [latitude, longitude])

    // ── 3. watchPosition — only updates state, nothing else ───────────────────
    //    Decoupled from map so there's no race condition on mobile.
    useEffect(() => {
        if (!isOpen) return

        if (!navigator.geolocation) {
            setGeoState('error')
            setGeoError('Geolocation not supported by this browser.')
            return
        }

        setGeoState('loading')
        setGeoError(null)

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                setGeoState('success')
            },
            (err) => {
                setGeoState('error')
                setGeoError(
                    err.code === 1
                        ? 'Location access denied. Enable permissions to see your position.'
                        : 'Unable to retrieve your location.'
                )
            },
            // maximumAge:0 forces a fresh fix on mobile — no stale cached position
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        )

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
                watchIdRef.current = null
            }
        }
    }, [isOpen])

    // ── 4. React to userCoords changes — map is guaranteed ready here ─────────
    useEffect(() => {
        if (!userCoords) return

        const { lat: uLat, lng: uLng } = userCoords
        setStraightDist(formatDistance(haversineDistance(uLat, uLng, latitude, longitude)))

        const map = mapRef.current
        if (!map) return

        // Move or place user marker
        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([uLat, uLng])
        } else {
            userMarkerRef.current = L.marker([uLat, uLng], { icon: USER_ICON })
                .addTo(map)
                .bindPopup(
                    `<div style="text-align:center;font-weight:bold;color:#166534;">
                        Your Location<br/>${uLat.toFixed(6)}, ${uLng.toFixed(6)}
                    </div>`
                )
        }

        // Re-fetch route only if moved past threshold
        const last = lastRouteFetchRef.current
        const movedEnough =
            !last || haversineMeters(last.lat, last.lng, uLat, uLng) > ROUTE_REFETCH_THRESHOLD_M

        if (movedEnough) fetchRoute(uLat, uLng)

    }, [userCoords, latitude, longitude, fetchRoute])

    // ── 5. Reset on close ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) {
            setGeoState('idle')
            setGeoError(null)
            setUserCoords(null)
            setStraightDist(null)
            setRouteState('idle')
            setRouteDistance(null)
            setRouteDuration(null)
            lastRouteFetchRef.current = null
        }
    }, [isOpen])

    if (!isOpen) return null

    const displayDistance = routeDistance ?? straightDist

    return (
        <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, pointerEvents: 'auto' }}
            onClick={onClose}
        >
            <div
                style={{ background: 'linear-gradient(135deg, rgba(167,216,245,0.1) 0%, rgba(137,194,217,0.05) 100%)', border: '1px solid rgba(167,216,245,0.25)', borderRadius: '4px', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(167,216,245,0.15)', width: '92vw', maxWidth: '1400px', height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', pointerEvents: 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent */}
                <div style={{ height: '2px', background: 'linear-gradient(to right, #A7D8F5, #89C2D9, transparent)' }} />

                {/* ── Header ────────────────────────────────────────────── */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(167,216,245,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', background: 'linear-gradient(to bottom, rgba(167,216,245,0.08), rgba(137,194,217,0.02))', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', fontWeight: 900, letterSpacing: '0.1em', color: '#F4FAFF', textTransform: 'uppercase', margin: 0, marginBottom: '0.25rem', textShadow: '0 0 20px rgba(167,216,245,0.25)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {planetName}
                        </h3>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)', color: 'rgba(205,239,253,0.7)', margin: 0, letterSpacing: '0.05em' }}>
                            {description}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                        {/* Live badge */}
                        {geoState === 'success' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'pulse 2s infinite' }} />
                                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.68rem', color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
                            </div>
                        )}

                        {/* Status messages */}
                        {geoState === 'loading' && (
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', color: '#A7D8F5', letterSpacing: '0.08em', opacity: 0.8 }}>⟳ Locating…</span>
                        )}
                        {geoState === 'success' && routeState === 'loading' && (
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', color: '#A7D8F5', letterSpacing: '0.08em', opacity: 0.8 }}>⟳ Routing…</span>
                        )}
                        {geoState === 'error' && (
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.65rem', color: '#fca5a5', letterSpacing: '0.03em', maxWidth: '160px', textAlign: 'right' }}>⚠ {geoError}</span>
                        )}
                        {routeState === 'error' && geoState !== 'error' && (
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.65rem', color: '#fcd34d', letterSpacing: '0.03em' }}>⚠ Straight-line only</span>
                        )}

                        {/* Close */}
                        <button
                            onClick={onClose}
                            style={{ background: 'rgba(167,216,245,0.08)', border: '1px solid rgba(167,216,245,0.25)', borderRadius: '2px', color: '#A7D8F5', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.3s ease', flexShrink: 0 }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.15)'; e.currentTarget.style.color = '#F4FAFF' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.08)'; e.currentTarget.style.color = '#A7D8F5' }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* ── Map ───────────────────────────────────────────────── */}
                <div ref={mapContainerRef} style={{ flex: 1, overflow: 'hidden', position: 'relative', borderBottom: '1px solid rgba(167,216,245,0.12)', minHeight: 0 }} />

                {/* ── Footer ────────────────────────────────────────────── */}
                <div style={{ padding: '0.75rem 1.25rem', background: 'linear-gradient(to top, rgba(137,194,217,0.05), rgba(167,216,245,0.03))', borderTop: '1px solid rgba(167,216,245,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Target */}
                    <div>
                        <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', color: '#89C2D9', textTransform: 'uppercase', margin: 0, marginBottom: '0.3rem' }}>Target</p>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', fontWeight: 700, color: '#F4FAFF', margin: 0 }}>
                            {latitude.toFixed(6)} N, {longitude.toFixed(6)} E
                        </p>
                    </div>

                    {/* Distance + duration */}
                    {geoState === 'success' && displayDistance && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', color: '#4ade80', textTransform: 'uppercase', margin: 0, marginBottom: '0.3rem' }}>
                                {routeState === 'success' ? 'By Road' : 'Straight Line'}
                            </p>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', fontWeight: 700, color: '#F4FAFF', margin: 0 }}>
                                {displayDistance}
                                {routeDuration && (
                                    <span style={{ color: 'rgba(244,250,255,0.55)', fontWeight: 400, marginLeft: '0.4rem' }}>· {routeDuration}</span>
                                )}
                            </p>
                        </div>
                    )}

                    {/* Your position */}
                    {geoState === 'success' && userCoords ? (
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', color: '#4ade80', textTransform: 'uppercase', margin: 0, marginBottom: '0.3rem' }}>Your Position</p>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', fontWeight: 700, color: '#F4FAFF', margin: 0 }}>
                                {userCoords.lat.toFixed(6)} N, {userCoords.lng.toFixed(6)} E
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '3px' }}>
                            {[0, 1, 2].map((i) => (
                                <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: i === 0 ? '#A7D8F5' : 'rgba(167,216,245,0.2)' }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom accent */}
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))' }} />

                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50%       { opacity: 0.4; transform: scale(1.4); }
                    }
                `}</style>
            </div>
        </div>
    )
}