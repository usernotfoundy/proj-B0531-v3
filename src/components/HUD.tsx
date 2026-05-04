import { useEffect, useRef } from 'react'
import { PLANETS } from '../config/planets.config'
import { useHUD } from '../hooks/useHUD'

export default function HUD() {
    const { activePlanetIndex, scrollProgress } = useHUD()

    // Keep prevIndexRef only to suppress re-renders on same planet
    const prevIndexRef = useRef(-1)
    useEffect(() => {
        prevIndexRef.current = activePlanetIndex
    }, [activePlanetIndex])

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10,
                pointerEvents: 'none',
                fontFamily: "'Orbitron', sans-serif",
            }}
        >

            {/* ── Top-left: mission label ─────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                }}
            >
                <span
                    style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.25em',
                        color: 'rgba(167, 216, 245, 0.5)',
                        textTransform: 'uppercase',
                    }}
                >
                    Solar Explorer
                </span>
                <span
                    style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.15em',
                        color: 'rgba(137, 194, 217, 0.3)',
                    }}
                >
                    {String(Math.round(scrollProgress * 100)).padStart(3, '0')}% traversed
                </span>
            </div>

            {/* ── Right side: vertical nav ────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '2rem',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0',
                }}
            >
                {/* Top cap */}
                <div style={{
                    width: '1px',
                    height: '3rem',
                    background: 'rgba(167, 216, 245, 0.12)',
                }} />

                {/* Planet dots */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0',
                    position: 'relative',
                }}>
                    {/* Track line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1px',
                        height: '100%',
                        background: 'rgba(167, 216, 245, 0.1)',
                    }} />

                    {/* Filled progress line */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1px',
                        height: `${scrollProgress * 100}%`,
                        background: 'rgba(137, 194, 217, 0.6)',
                        transition: 'height 0.1s linear',
                    }} />

                    {PLANETS.map((planet, index) => {
                        const isActive = index === activePlanetIndex
                        const isPassed = index < activePlanetIndex

                        return (
                            <div
                                key={planet.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                    padding: '0.75rem 0',
                                }}
                            >
                                {/* Dot */}
                                <div style={{
                                    width: isActive ? '8px' : '4px',
                                    height: isActive ? '8px' : '4px',
                                    borderRadius: '50%',
                                    background: isActive
                                        ? '#A7D8F5'
                                        : isPassed
                                            ? 'rgba(137, 194, 217, 0.6)'
                                            : 'rgba(167, 216, 245, 0.15)',
                                    boxShadow: isActive
                                        ? '0 0 8px rgba(167, 216, 245, 0.7)'
                                        : 'none',
                                    transition: 'all 0.4s ease',
                                    position: 'relative',
                                    zIndex: 1,
                                }} />

                                {/* Planet name label */}
                                <div style={{
                                    position: 'absolute',
                                    right: '1.2rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '0.5rem',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: isActive
                                        ? '#CDEFFD'
                                        : 'rgba(137, 194, 217, 0.3)',
                                    whiteSpace: 'nowrap',
                                    transition: 'color 0.4s ease',
                                }}>
                                    {planet.name}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom cap */}
                <div style={{
                    width: '1px',
                    height: '3rem',
                    background: 'rgba(167, 216, 245, 0.12)',
                }} />
            </div>

            {/* ── Bottom-right: scroll hint ────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    right: '2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    opacity: scrollProgress < 0.02 ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                }}
            >
                <span style={{
                    fontSize: '0.5rem',
                    letterSpacing: '0.25em',
                    color: 'rgba(167, 216, 245, 0.5)',
                    textTransform: 'uppercase',
                }}>
                    Scroll
                </span>
                <div style={{
                    width: '1px',
                    height: '2rem',
                    background: 'linear-gradient(to bottom, rgba(137,194,217,0.6), transparent)',
                    animation: 'scrollPulse 2s ease-in-out infinite',
                }} />
            </div>

        </div>
    )
}