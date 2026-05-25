import { useEffect, useRef } from 'react'
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
    // const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    // Handle window resize for responsive design
    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsMobile(window.innerWidth < 768)
    //     }

    //     window.addEventListener('resize', handleResize)
    //     return () => window.removeEventListener('resize', handleResize)
    // }, [])

    useEffect(() => {
        if (isOpen && mapContainerRef.current && !mapRef.current) {
            // Initialize map
            const map = L.map(mapContainerRef.current).setView([latitude, longitude], 18)

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map)

            // Add marker for the location
            const marker = L.marker([latitude, longitude], {
                icon: L.icon({
                    iconUrl:
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 40"><path d="M12 0C5.37 0 0 5.37 0 12c0 7 12 26 12 26s12-19 12-26c0-6.63-5.37-12-12-12z" fill="%2329657a"/><circle cx="12" cy="12" r="5" fill="%23A0DAF1"/></svg>',
                    iconSize: [32, 40],
                    iconAnchor: [16, 40],
                }),
            }).addTo(map)

            marker.bindPopup(
                `<div style="text-align: center; font-weight: bold; color: #29657a;">${planetName}<br/>${description}<br/>${latitude.toFixed(6)}, ${longitude.toFixed(6)}</div>`
            )

            mapRef.current = map

            // Trigger map resize after a brief delay
            setTimeout(() => {
                map.invalidateSize()
            }, 100)
        }

        return () => {
            if (!isOpen && mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [isOpen, latitude, longitude, planetName, description])

    if (!isOpen) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
            {/* ── Modal Container ────────────────────────────────────── */}
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(167,216,245,0.1) 0%, rgba(137,194,217,0.05) 100%)',
                    border: '1px solid rgba(167,216,245,0.25)',
                    borderRadius: '4px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(167,216,245,0.15)',
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
                <div
                    style={{
                        height: '2px',
                        background: 'linear-gradient(to right, #A7D8F5, #89C2D9, transparent)',
                    }}
                />

                {/* ── Header ─────────────────────────────────────────── */}
                <div
                    style={{
                        padding: '1.5rem 1.75rem',
                        borderBottom: '1px solid rgba(167,216,245,0.12)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background:
                            'linear-gradient(to bottom, rgba(167,216,245,0.08), rgba(137,194,217,0.02))',
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
                        <p
                            style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '0.75rem',
                                color: 'rgba(205,239,253,0.7)',
                                margin: 0,
                                letterSpacing: '0.05em',
                            }}
                        >
                            {description}
                        </p>
                    </div>

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

                {/* ── Map Container ──────────────────────────────────── */}
                <div
                    ref={mapContainerRef}
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                        position: 'relative',
                        borderBottom: '1px solid rgba(167,216,245,0.12)',
                    }}
                />

                {/* ── Footer with Coordinates ────────────────────────── */}
                <div
                    style={{
                        padding: '1rem 1.75rem',
                        background: 'linear-gradient(to top, rgba(137,194,217,0.05), rgba(167,216,245,0.03))',
                        borderTop: '1px solid rgba(167,216,245,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <p
                            style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '0.65rem',
                                letterSpacing: '0.15em',
                                color: '#89C2D9',
                                textTransform: 'uppercase',
                                margin: 0,
                                marginBottom: '0.4rem',
                            }}
                        >
                            Coordinates
                        </p>
                        <p
                            style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: '#F4FAFF',
                                margin: 0,
                                letterSpacing: '0.02em',
                            }}
                        >
                            {latitude.toFixed(6)} N, {longitude.toFixed(6)} E
                        </p>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '3px',
                        }}
                    >
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
                </div>

                {/* Bottom accent bar */}
                <div
                    style={{
                        height: '1px',
                        background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))',
                    }}
                />
            </div>
        </div>
    )
}
