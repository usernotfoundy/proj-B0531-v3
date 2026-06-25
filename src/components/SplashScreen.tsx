import { useEffect, useState } from 'react'
import type { Spaceship } from '../scene/Spaceship'
import { loadingTracker } from '../scene/LoadingTracker'

interface Props {
    spaceshipRef: React.MutableRefObject<Spaceship | null>
    onDismiss: () => void
}

export default function SplashScreen({ spaceshipRef, onDismiss }: Props) {
    const [phase, setPhase] = useState<'launching' | 'ready' | 'leaving'>('launching')
    const [loadProgress, setLoadProgress] = useState(0)

    useEffect(() => {
        return loadingTracker.subscribe(setLoadProgress)
    }, [])

    useEffect(() => {
        let cancelled = false

        const waitForShip = async () => {
            while (!spaceshipRef.current && !cancelled) {
                await new Promise((r) => setTimeout(r, 100))
            }
            if (cancelled) return

            await spaceshipRef.current!.ready
            if (!cancelled) setPhase('ready')
        }

        waitForShip()
        return () => { cancelled = true }
    }, [spaceshipRef])

    const handleLaunch = () => {
        setPhase('leaving')
        setTimeout(onDismiss, 900)   // match fade-out duration
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Orbitron', sans-serif",
                pointerEvents: phase === 'leaving' ? 'none' : 'auto',
                // Fade out the whole splash
                opacity: phase === 'leaving' ? 0 : 1,
                transition: 'opacity 0.9s ease',
                // Gradient overlay — dark at edges, transparent at center
                // so the Three.js scene shows through the middle
                background: phase === 'leaving'
                    ? 'transparent'
                    : 'radial-gradient(ellipse at center, rgba(0,0,15,0.55) 0%, rgba(0,0,15,0.92) 100%)',
            }}
        >

            {/* ── Top decoration line ───────────────────────────── */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.3), transparent)',
            }} />

            {/* ── Main content ──────────────────────────────────── */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.2rem',
                marginBottom: '12rem',   // push up so ship is visible below
                opacity: phase === 'leaving' ? 0 : 1,
                transform: phase === 'leaving' ? 'translateY(-20px)' : 'translateY(0)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>

                {/* Eyebrow */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                }}>
                    <div style={{
                        width: '2rem',
                        height: '1px',
                        background: 'rgba(137,194,217,0.5)',
                    }} />
                    <span style={{
                        fontSize: '0.5rem',
                        letterSpacing: '0.4em',
                        color: 'rgba(137,194,217,0.6)',
                        textTransform: 'uppercase',
                    }}>
                        You Are Invited
                    </span>
                    <div style={{
                        width: '2rem',
                        height: '1px',
                        background: 'rgba(137,194,217,0.5)',
                    }} />
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    color: '#F4FAFF',
                    textShadow: '0 0 60px rgba(167,216,245,0.35), 0 0 120px rgba(137,194,217,0.15)',
                    lineHeight: 1.2,
                    textAlign: 'center',
                    textTransform: 'none',
                }}>
                    One Small Step for a
                    <br />
                    <span style={{ color: '#A7D8F5' }}>One-Year-Old</span>
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.08em',
                    color: 'rgba(205,239,253,0.6)',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    maxWidth: '90vw',
                    textTransform: 'none',
                }}>
                    Join us as we celebrate Xyz's first trip around the sun
                    <br />
                    and his celestial blessing
                </p>

            </div>

            {/* ── Launch button — only when ship is ready ────────── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '3.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    opacity: phase === 'ready' ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                    pointerEvents: phase === 'ready' ? 'auto' : 'none',
                }}
            >
                <button
                    onClick={handleLaunch}
                    style={{
                        padding: '0.85rem 2.8rem',
                        background: 'rgba(167,216,245,0.08)',
                        border: '1px solid rgba(167,216,245,0.35)',
                        borderRadius: '2px',
                        color: '#F4FAFF',
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '0.6rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(167,216,245,0.16)'
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(167,216,245,0.18), inset 0 0 20px rgba(167,216,245,0.05)'
                        e.currentTarget.style.borderColor = 'rgba(167,216,245,0.6)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(167,216,245,0.08)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = 'rgba(167,216,245,0.35)'
                    }}
                >
                    Begin Celebration
                </button>

                {/* Corner accents on button area */}
                <div style={{
                    fontSize: '0.4rem',
                    letterSpacing: '0.25em',
                    color: 'rgba(137,194,217,0.3)',
                    textTransform: 'uppercase',
                }}>
                    Explore the celestial journey
                </div>

            </div>

            {/* ── Launching state indicator ─────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '3.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    opacity: phase === 'launching' ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none',
                    width: 'min(280px, 70vw)',
                }}
            >
                <div style={{
                    width: '100%',
                    height: '2px',
                    background: 'rgba(137,194,217,0.15)',
                    borderRadius: '1px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.round(loadProgress * 100)}%`,
                        background: 'linear-gradient(to right, #89C2D9, #A7D8F5)',
                        transition: 'width 0.2s ease',
                    }} />
                </div>
                <span style={{
                    fontSize: '0.45rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(137,194,217,0.5)',
                    textTransform: 'uppercase',
                }}>
                    {loadProgress < 1
                        ? `Loading assets ${Math.round(loadProgress * 100)}%`
                        : 'Launching'}
                </span>
                {loadProgress < 1 && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: '#89C2D9',
                                    animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Bottom decoration line ─────────────────────────── */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.2), transparent)',
            }} />

        </div>
    )
}