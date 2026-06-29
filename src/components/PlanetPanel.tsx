import { useEffect, useRef, useState } from 'react'
import { PLANETS } from '../config/planets.config'
import { useHUD } from '../hooks/useHUD'
import type { GodparentsData, HealthProtocolsData, InvitationData, LocationCoordinate, PhotoGalleryData } from '../types/planet.types'

interface CoordinatesData {
  planetName: string
  description?: string
  locations: LocationCoordinate[]
}

interface GodparentsModalData {
  planetName: string
  description?: string
  godparents: GodparentsData
}

interface HealthProtocolsModalData {
  planetName: string
  healthProtocols: HealthProtocolsData
}

interface PhotoGalleryModalData {
  planetName: string
  photoGallery: PhotoGalleryData
}

interface InvitationModalData {
  planetName: string
  invitation: InvitationData
}

interface PlanetPanelProps {
  onShowCoordinates?: (data: CoordinatesData) => void
  onShowGodparents?: (data: GodparentsModalData) => void
  onShowHealthProtocols?: (data: HealthProtocolsModalData) => void
  onShowPhotoGallery?: (data: PhotoGalleryModalData) => void
  onShowInvitation?: (data: InvitationModalData) => void
}

export default function PlanetPanel({ onShowCoordinates, onShowGodparents, onShowHealthProtocols, onShowPhotoGallery, onShowInvitation }: PlanetPanelProps) {
    const { activePlanetIndex, planetProgress } = useHUD()
    // const planet = PLANETS[activePlanetIndex]

    // Earth holds in place; other worlds show the panel as you fly into them
    const isVisible = activePlanetIndex === 0
        ? planetProgress > 0.08 && planetProgress < 0.82
        : planetProgress > 0.5 && planetProgress < 0.88

    const [renderedIndex, setRenderedIndex] = useState(activePlanetIndex)
    const [animState, setAnimState] = useState<'in' | 'out' | 'idle'>('idle')
    const prevIndexRef = useRef(activePlanetIndex)

    useEffect(() => {
        if (prevIndexRef.current === activePlanetIndex) return
        prevIndexRef.current = activePlanetIndex

        // Swap planet content immediately — panel handles its own fade
        setRenderedIndex(activePlanetIndex)
        setAnimState('in')
    }, [activePlanetIndex])

    useEffect(() => {
        if (isVisible && animState === 'idle') {
            setAnimState('in')
        } else if (!isVisible && animState === 'idle') {
            setAnimState('out')
        }
    }, [isVisible])

    const planet = PLANETS[renderedIndex]
    const panelFacts = planet.godparents
        ? [
            { label: 'Godmothers', value: String(planet.godparents.godmothers.length), unit: 'NINANG' },
            { label: 'Godfathers', value: String(planet.godparents.godfathers.length), unit: 'NINONG' },
            {
                label: 'Total Crew',
                value: String(planet.godparents.godmothers.length + planet.godparents.godfathers.length),
                unit: 'GUARDIANS',
            },
        ]
        : planet.facts

    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '2.5rem',
                transform: 'translateY(-50%)',
                zIndex: 10,
                pointerEvents: 'none',
                width: 'clamp(260px, 22vw, 340px)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.7s ease',
                animation: isVisible
                    ? 'panelSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                    : 'panelSlideOut 0.5s ease forwards',
            }}
        >
            {/* ── Outer glass panel ──────────────────────────────────── */}
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(167,216,245,0.07) 0%, rgba(137,194,217,0.04) 100%)',
                    border: '1px solid rgba(167,216,245,0.18)',
                    borderRadius: '2px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Scanline sweep effect */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(167,216,245,0.04) 50%, transparent 60%)',
                        animation: 'scanline 4s linear infinite',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />

                {/* Top accent bar */}
                <div style={{
                    height: '2px',
                    background: 'linear-gradient(to right, #A7D8F5, #89C2D9, transparent)',
                }} />

                <div style={{ padding: '1.5rem 1.75rem', position: 'relative', zIndex: 1 }}>

                    {/* ── Header ─────────────────────────────────────────── */}
                    <div style={{ marginBottom: '1.25rem' }}>

                        {/* Object ID tag */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.6rem',
                        }}>
                            <div style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                background: '#A7D8F5',
                                boxShadow: '0 0 6px #A7D8F5',
                            }} />
                            <span style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '0.5rem',
                                letterSpacing: '0.3em',
                                color: '#89C2D9',
                                textTransform: 'uppercase',
                            }}>
                                Object {String(activePlanetIndex + 1).padStart(2, '0')} · Identified
                            </span>
                        </div>

                        {/* Planet name */}
                        <h2 style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                            fontWeight: 900,
                            letterSpacing: '0.06em',
                            color: '#F4FAFF',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            textShadow: '0 0 30px rgba(167,216,245,0.35)',
                        }}>
                            {PLANETS[renderedIndex].name}
                        </h2>

                    </div>

                    {/* ── Divider ─────────────────────────────────────────── */}
                    <div style={{
                        height: '1px',
                        background: 'linear-gradient(to right, rgba(167,216,245,0.4), transparent)',
                        marginBottom: '1rem',
                    }} />

                    {/* ── Description ─────────────────────────────────────── */}
                    {PLANETS[renderedIndex].description && (
                        <p style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: '0.7rem',
                            lineHeight: 1.7,
                            color: 'rgba(205,239,253,0.65)',
                            marginBottom: '1.25rem',
                            fontWeight: 400,
                        }}>
                            {PLANETS[renderedIndex].description}
                        </p>
                    )}

                    {/* ── Facts grid ──────────────────────────────────────── */}
                    {panelFacts && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.1rem',
                        }}>
                            {panelFacts.map((fact, i) => (
                                <div
                                    key={fact.label}
                                    style={{
                                        padding: '0.6rem 0.5rem',
                                        borderBottom: '1px solid rgba(167,216,245,0.08)',
                                        animation: `statReveal 0.4s ease forwards`,
                                        animationDelay: `${0.1 + i * 0.06}s`,
                                        opacity: 0,
                                    }}
                                >
                                    <div style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        fontSize: '0.42rem',
                                        letterSpacing: '0.2em',
                                        color: '#89C2D9',
                                        textTransform: 'uppercase',
                                        marginBottom: '0.25rem',
                                    }}>
                                        {fact.label}
                                    </div>
                                    <div style={{
                                        fontFamily: "'Syne', sans-serif",
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: '#F4FAFF',
                                        letterSpacing: '0.02em',
                                        lineHeight: 1,
                                    }}>
                                        {fact.value}
                                        {fact.unit && (
                                            <div style={{
                                                fontSize: '0.55rem',
                                                fontWeight: 400,
                                                color: 'rgba(167,216,245,0.5)',
                                                marginTop: '0.15rem',
                                            }}>
                                                {fact.unit}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Button ──────────────────────────────────────────── */}
                    {planet.button && (
                        <button
                            onClick={() => {
                                if (planet.coordinates && onShowCoordinates) {
                                    onShowCoordinates({
                                        planetName: planet.name,
                                        description: planet.coordinates.description,
                                        locations: planet.coordinates.locations,
                                    })
                                } else if (planet.godparents && onShowGodparents) {
                                    onShowGodparents({
                                        planetName: planet.name,
                                        description: planet.description,
                                        godparents: planet.godparents,
                                    })
                                } else if (planet.healthProtocols && onShowHealthProtocols) {
                                    onShowHealthProtocols({
                                        planetName: planet.name,
                                        healthProtocols: planet.healthProtocols,
                                    })
                                } else if (planet.photoGallery && onShowPhotoGallery) {
                                    onShowPhotoGallery({
                                        planetName: planet.name,
                                        photoGallery: planet.photoGallery,
                                    })
                                } else if (planet.invitation && onShowInvitation) {
                                    onShowInvitation({
                                        planetName: planet.name,
                                        invitation: planet.invitation,
                                    })
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.8rem',
                                marginBottom: '1rem',
                                marginTop: '1rem',
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '0.65rem',
                                letterSpacing: '0.15em',
                                fontWeight: 700,
                                color: '#A7D8F5',
                                backgroundColor: 'rgba(167,216,245,0.05)',
                                border: '1px solid rgba(167,216,245,0.3)',
                                borderRadius: '1px',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 0 12px rgba(167,216,245,0)',
                                pointerEvents: 'auto',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.12)';
                                e.currentTarget.style.boxShadow = '0 0 12px rgba(167,216,245,0.3)';
                                e.currentTarget.style.color = '#F4FAFF';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.05)';
                                e.currentTarget.style.boxShadow = '0 0 12px rgba(167,216,245,0)';
                                e.currentTarget.style.color = '#A7D8F5';
                            }}
                        >
                            {planet.button.label}
                        </button>
                    )}

                    {/* ── Footer tag ──────────────────────────────────────── */}
                    <div style={{
                        marginTop: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(167,216,245,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '0.4rem',
                            letterSpacing: '0.25em',
                            color: 'rgba(137,194,217,0.3)',
                            textTransform: 'uppercase',
                        }}>
                            Solar Explorer · Data Log
                        </span>
                        <div style={{
                            display: 'flex',
                            gap: '3px',
                            alignItems: 'center',
                        }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '3px',
                                    height: '3px',
                                    borderRadius: '50%',
                                    background: i === 0 ? '#A7D8F5' : 'rgba(167,216,245,0.2)',
                                }} />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom accent bar */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.2))',
                }} />

            </div>

            {/* Corner accent — bottom right */}
            <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '12px',
                height: '12px',
                borderRight: '1px solid rgba(167,216,245,0.4)',
                borderBottom: '1px solid rgba(167,216,245,0.4)',
                pointerEvents: 'none',
            }} />

            {/* Corner accent — top left */}
            <div style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                width: '12px',
                height: '12px',
                borderLeft: '1px solid rgba(167,216,245,0.4)',
                borderTop: '1px solid rgba(167,216,245,0.4)',
                pointerEvents: 'none',
            }} />
        </div>
    )
}