import { useEffect, useRef, useState } from 'react'
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

// Haversine formula — returns distance in kilometers
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

function formatDistance(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

// SVG icon factory using divIcon to avoid default Leaflet asset issues
function makeSvgIcon(svgContent: string, size: [number, number], anchor: [number, number]) {
    return L.divIcon({
        html: svgContent,
        iconSize: size,
        iconAnchor: anchor,
        className: '',
    })
}

const TARGET_ICON = makeSvgIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40" width="32" height="40">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 7 12 26 12 26s12-19 12-26C24 5.37 18.63 0 12 0z" fill="#29657a"/>
        <circle cx="12" cy="12" r="5" fill="#A0DAF1"/>
    </svg>`,
    [32, 40],
    [16, 40],
)

const USER_ICON = makeSvgIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28">
        <circle cx="14" cy="14" r="13" fill="rgba(100,200,120,0.15)" stroke="#4ade80" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="6" fill="#4ade80"/>
        <circle cx="14" cy="14" r="3" fill="#fff"/>
    </svg>`,
    [28, 28],
    [14, 14],
)

type GeoState = 'idle' | 'loading' | 'success' | 'error'

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
    const polylineRef = useRef<L.Polyline | null>(null)

    const [geoState, setGeoState] = useState<GeoState>('idle')
    const [geoError, setGeoError] = useState<string | null>(null)
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
    const [distance, setDistance] = useState<string | null>(null)

    // ── Map init ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isOpen && mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map)

            const marker = L.marker([latitude, longitude], { icon: TARGET_ICON }).addTo(map)
            marker.bindPopup(
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
                polylineRef.current = null
            }
        }
    }, [isOpen, latitude, longitude, planetName, description])

    // ── Auto-locate on open ───────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return

        if (!navigator.geolocation) {
            setGeoState('error')
            setGeoError('Geolocation not supported by this browser.')
            return
        }

        setGeoState('loading')
        setGeoError(null)

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: uLat, longitude: uLng } = pos.coords
                setUserCoords({ lat: uLat, lng: uLng })
                setGeoState('success')
                setDistance(formatDistance(haversineDistance(uLat, uLng, latitude, longitude)))

                const map = mapRef.current
                if (!map) return

                // Place / update user marker
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

                // Draw / update polyline
                if (polylineRef.current) {
                    polylineRef.current.setLatLngs([[uLat, uLng], [latitude, longitude]])
                } else {
                    polylineRef.current = L.polyline(
                        [[uLat, uLng], [latitude, longitude]],
                        { color: '#4ade80', weight: 1.5, opacity: 0.6, dashArray: '6 6' }
                    ).addTo(map)
                }

                // Fit both markers in view
                map.fitBounds(
                    L.latLngBounds([uLat, uLng], [latitude, longitude]),
                    { padding: [48, 48] }
                )
            },
            (err) => {
                setGeoState('error')
                setGeoError(
                    err.code === 1
                        ? 'Location access denied. Enable permissions to see your position.'
                        : 'Unable to retrieve your location.'
                )
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }, [isOpen, latitude, longitude])

    // ── Reset on close ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) {
            setGeoState('idle')
            setGeoError(null)
            setUserCoords(null)
            setDistance(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                pointerEvents: 'auto',
            }}
            onClick={onClose}
        >
            {/* ── Modal Container ────────────────────────────────────────── */}
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(167,216,245,0.1) 0%, rgba(137,194,217,0.05) 100%)',
                    border: '1px solid rgba(167,216,245,0.25)',
                    borderRadius: '4px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(167,216,245,0.15)',
                    width: '85vw',
                    maxWidth: '1400px',
                    height: '75vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                    pointerEvents: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent bar */}
                <div style={{ height: '2px', background: 'linear-gradient(to right, #A7D8F5, #89C2D9, transparent)' }} />

                {/* ── Header ─────────────────────────────────────────────── */}
                <div
                    style={{
                        padding: '1.5rem 1.75rem',
                        borderBottom: '1px solid rgba(167,216,245,0.12)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        background: 'linear-gradient(to bottom, rgba(167,216,245,0.08), rgba(137,194,217,0.02))',
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '1.1rem',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                color: '#F4FAFF',
                                textTransform: 'uppercase',
                                margin: 0,
                                marginBottom: '0.3rem',
                                textShadow: '0 0 20px rgba(167,216,245,0.25)',
                            }}
                        >
                            {planetName}
                        </h3>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', color: 'rgba(205,239,253,0.7)', margin: 0, letterSpacing: '0.05em' }}>
                            {description}
                        </p>
                    </div>

                    {/* Geo status */}
                    {geoState === 'loading' && (
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', color: '#A7D8F5', letterSpacing: '0.08em', opacity: 0.8 }}>
                            ⟳ Locating…
                        </span>
                    )}
                    {geoState === 'error' && (
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', color: '#fca5a5', letterSpacing: '0.05em', maxWidth: '220px', textAlign: 'right' }}>
                            ⚠ {geoError}
                        </span>
                    )}

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(167,216,245,0.08)',
                            border: '1px solid rgba(167,216,245,0.25)',
                            borderRadius: '2px',
                            color: '#A7D8F5',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 0 8px rgba(167,216,245,0)',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.15)'
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(167,216,245,0.3)'
                            e.currentTarget.style.color = '#F4FAFF'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.08)'
                            e.currentTarget.style.boxShadow = '0 0 8px rgba(167,216,245,0)'
                            e.currentTarget.style.color = '#A7D8F5'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* ── Map ────────────────────────────────────────────────── */}
                <div
                    ref={mapContainerRef}
                    style={{ flex: 1, overflow: 'hidden', position: 'relative', borderBottom: '1px solid rgba(167,216,245,0.12)' }}
                />

                {/* ── Footer ─────────────────────────────────────────────── */}
                <div
                    style={{
                        padding: '1rem 1.75rem',
                        background: 'linear-gradient(to top, rgba(137,194,217,0.05), rgba(167,216,245,0.03))',
                        borderTop: '1px solid rgba(167,216,245,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {/* Target coordinates */}
                    <div>
                        <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', color: '#89C2D9', textTransform: 'uppercase', margin: 0, marginBottom: '0.4rem' }}>
                            Target
                        </p>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#F4FAFF', margin: 0 }}>
                            {latitude.toFixed(6)} N, {longitude.toFixed(6)} E
                        </p>
                    </div>

                    {/* Distance */}
                    {geoState === 'success' && distance && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', color: '#4ade80', textTransform: 'uppercase', margin: 0, marginBottom: '0.4rem' }}>
                                Distance
                            </p>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#F4FAFF', margin: 0 }}>
                                {distance}
                            </p>
                        </div>
                    )}

                    {/* Your position */}
                    {geoState === 'success' && userCoords ? (
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.65rem', letterSpacing: '0.15em', color: '#4ade80', textTransform: 'uppercase', margin: 0, marginBottom: '0.4rem' }}>
                                Your Position
                            </p>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#F4FAFF', margin: 0 }}>
                                {userCoords.lat.toFixed(6)} N, {userCoords.lng.toFixed(6)} E
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '3px' }}>
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '3px',
                                        height: '3px',
                                        borderRadius: '50%',
                                        background: i === 0 ? '#A7D8F5' : 'rgba(167,216,245,0.2)',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom accent bar */}
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))' }} />
            </div>
        </div>
    )
}