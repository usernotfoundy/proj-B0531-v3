import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import type { InvitationData } from '../types/planet.types'

interface InvitationModalProps {
    isOpen: boolean
    onClose: () => void
    planetName: string
    invitation: InvitationData
}

const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.75rem 0.85rem',
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.85rem',
    color: '#F4FAFF',
    background: 'rgba(167,216,245,0.06)',
    border: '1px solid rgba(167,216,245,0.2)',
    borderRadius: '2px',
    outline: 'none',
    boxSizing: 'border-box',
}

const labelStyle: CSSProperties = {
    display: 'block',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '0.5rem',
    letterSpacing: '0.2em',
    color: '#89C2D9',
    textTransform: 'uppercase',
    marginBottom: '0.45rem',
}

export default function InvitationModal({
    isOpen,
    onClose,
    planetName,
    invitation,
}: InvitationModalProps) {
    const [fullName, setFullName] = useState('')
    const [guestCount, setGuestCount] = useState(1)
    const [submitPhase, setSubmitPhase] = useState<'form' | 'submitting' | 'success'>('form')

    const MIN_GUESTS = 1
    const MAX_GUESTS = 20

    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose])

    useEffect(() => {
        if (!isOpen) {
            setFullName('')
            setGuestCount(1)
            setSubmitPhase('form')
        }
    }, [isOpen])

    useEffect(() => {
        if (submitPhase !== 'submitting') return

        const timer = window.setTimeout(() => {
            setSubmitPhase('success')
        }, 1800)

        return () => window.clearTimeout(timer)
    }, [submitPhase])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!fullName.trim() || submitPhase !== 'form') return
        setSubmitPhase('submitting')
    }

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
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(167,216,245,0.1) 0%, rgba(137,194,217,0.05) 100%)',
                    border: '1px solid rgba(167,216,245,0.25)',
                    borderRadius: '4px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(167,216,245,0.15)',
                    width: '92vw',
                    maxWidth: '480px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                    pointerEvents: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ height: '2px', background: 'linear-gradient(to right, #A7D8F5, #89C2D9, transparent)' }} />

                <div style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid rgba(167,216,245,0.12)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'linear-gradient(to bottom, rgba(167,216,245,0.08), rgba(137,194,217,0.02))',
                }}>
                    <div style={{ minWidth: 0 }}>
                        <h3 style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)',
                            fontWeight: 900,
                            letterSpacing: '0.1em',
                            color: '#F4FAFF',
                            textTransform: 'uppercase',
                            margin: 0,
                            marginBottom: '0.25rem',
                            textShadow: '0 0 20px rgba(167,216,245,0.25)',
                        }}>
                            {planetName}
                        </h3>
                        <p style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                            color: 'rgba(205,239,253,0.7)',
                            margin: 0,
                            letterSpacing: '0.05em',
                        }}>
                            {invitation.title}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            background: 'rgba(167,216,245,0.08)',
                            border: '1px solid rgba(167,216,245,0.25)',
                            borderRadius: '2px',
                            color: '#A7D8F5',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.15)'
                            e.currentTarget.style.color = '#F4FAFF'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.08)'
                            e.currentTarget.style.color = '#A7D8F5'
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ padding: '1.25rem', minHeight: '220px' }}>
                    {submitPhase === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                margin: '0 auto 1rem',
                                borderRadius: '50%',
                                border: '2px solid #4ade80',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(74,222,128,0.35)',
                                animation: 'invitationCheckPop 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                            }}>
                                <span style={{
                                    fontSize: '1.5rem',
                                    color: '#4ade80',
                                    lineHeight: 1,
                                    animation: 'invitationCheckDraw 0.4s ease 0.2s both',
                                }}>
                                    ✓
                                </span>
                            </div>
                            <p style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '0.7rem',
                                letterSpacing: '0.15em',
                                color: '#4ade80',
                                textTransform: 'uppercase',
                                margin: 0,
                                marginBottom: '0.75rem',
                                animation: 'statReveal 0.45s ease 0.15s both',
                            }}>
                                Transmission Received
                            </p>
                            <p style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '0.85rem',
                                lineHeight: 1.7,
                                color: 'rgba(205,239,253,0.75)',
                                margin: 0,
                                animation: 'statReveal 0.45s ease 0.3s both',
                            }}>
                                Thank you, {fullName.trim()}. We have recorded {guestCount} guest{guestCount !== 1 ? 's' : ''}.
                            </p>
                        </div>
                    ) : submitPhase === 'submitting' ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem 0',
                            gap: '1.25rem',
                            animation: 'invitationSubmitFadeIn 0.35s ease forwards',
                        }}>
                            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '50%',
                                    border: '2px solid rgba(167,216,245,0.15)',
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '50%',
                                    border: '2px solid transparent',
                                    borderTopColor: '#A7D8F5',
                                    borderRightColor: '#89C2D9',
                                    animation: 'invitationOrbitSpin 0.9s linear infinite',
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    inset: '14px',
                                    borderRadius: '50%',
                                    background: 'rgba(167,216,245,0.12)',
                                    boxShadow: '0 0 16px rgba(167,216,245,0.25)',
                                    animation: 'invitationCorePulse 1.2s ease-in-out infinite',
                                }} />
                            </div>

                            <div style={{ width: '100%', maxWidth: '240px' }}>
                                <p style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    fontSize: '0.62rem',
                                    letterSpacing: '0.18em',
                                    color: '#A7D8F5',
                                    textTransform: 'uppercase',
                                    margin: 0,
                                    marginBottom: '0.65rem',
                                    textAlign: 'center',
                                }}>
                                    Transmitting
                                    <span style={{ animation: 'invitationDots 1.2s steps(4, end) infinite' }}>...</span>
                                </p>
                                <div style={{
                                    height: '3px',
                                    borderRadius: '2px',
                                    background: 'rgba(167,216,245,0.12)',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        background: 'linear-gradient(to right, #89C2D9, #A7D8F5)',
                                        boxShadow: '0 0 10px rgba(167,216,245,0.5)',
                                        animation: 'invitationProgressFill 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                                    }} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '0.8rem',
                                lineHeight: 1.75,
                                color: 'rgba(205,239,253,0.75)',
                                margin: 0,
                                marginBottom: '1.25rem',
                            }}>
                                {invitation.subtitle}
                            </p>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label htmlFor="invitation-full-name" style={labelStyle}>
                                        Full Name
                                    </label>
                                    <input
                                        id="invitation-full-name"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        placeholder="Enter your full name"
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <span id="invitation-guest-count" style={labelStyle}>
                                        Number of Guests
                                    </span>
                                    <div
                                        role="group"
                                        aria-labelledby="invitation-guest-count"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'stretch',
                                            border: '1px solid rgba(167,216,245,0.2)',
                                            borderRadius: '2px',
                                            overflow: 'hidden',
                                            background: 'rgba(167,216,245,0.06)',
                                        }}
                                    >
                                        <button
                                            type="button"
                                            aria-label="Decrease guest count"
                                            disabled={guestCount <= MIN_GUESTS}
                                            onClick={() => setGuestCount((count) => Math.max(MIN_GUESTS, count - 1))}
                                            style={{
                                                width: '3rem',
                                                flexShrink: 0,
                                                fontFamily: "'Orbitron', sans-serif",
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                color: guestCount <= MIN_GUESTS ? 'rgba(167,216,245,0.3)' : '#A7D8F5',
                                                background: 'rgba(167,216,245,0.08)',
                                                border: 'none',
                                                borderRight: '1px solid rgba(167,216,245,0.2)',
                                                cursor: guestCount <= MIN_GUESTS ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            −
                                        </button>
                                        <div
                                            aria-live="polite"
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontFamily: "'Syne', sans-serif",
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: '#F4FAFF',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            {guestCount}
                                        </div>
                                        <button
                                            type="button"
                                            aria-label="Increase guest count"
                                            disabled={guestCount >= MAX_GUESTS}
                                            onClick={() => setGuestCount((count) => Math.min(MAX_GUESTS, count + 1))}
                                            style={{
                                                width: '3rem',
                                                flexShrink: 0,
                                                fontFamily: "'Orbitron', sans-serif",
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                color: guestCount >= MAX_GUESTS ? 'rgba(167,216,245,0.3)' : '#A7D8F5',
                                                background: 'rgba(167,216,245,0.08)',
                                                border: 'none',
                                                borderLeft: '1px solid rgba(167,216,245,0.2)',
                                                cursor: guestCount >= MAX_GUESTS ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitPhase !== 'form'}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.8rem',
                                        marginTop: '0.5rem',
                                        fontFamily: "'Orbitron', sans-serif",
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.15em',
                                        fontWeight: 700,
                                        color: '#F4FAFF',
                                        backgroundColor: 'rgba(167,216,245,0.15)',
                                        border: '1px solid rgba(167,216,245,0.4)',
                                        borderRadius: '2px',
                                        cursor: submitPhase === 'form' ? 'pointer' : 'not-allowed',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 0 12px rgba(167,216,245,0.2)',
                                        opacity: submitPhase === 'form' ? 1 : 0.6,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.25)'
                                        e.currentTarget.style.boxShadow = '0 0 16px rgba(167,216,245,0.35)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(167,216,245,0.15)'
                                        e.currentTarget.style.boxShadow = '0 0 12px rgba(167,216,245,0.2)'
                                    }}
                                >
                                    Submit
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div style={{
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(to top, rgba(137,194,217,0.05), rgba(167,216,245,0.03))',
                    borderTop: '1px solid rgba(167,216,245,0.08)',
                }}>
                    <span style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '0.4rem',
                        letterSpacing: '0.25em',
                        color: 'rgba(137,194,217,0.4)',
                        textTransform: 'uppercase',
                    }}>
                        Solar Explorer · Guest Registry
                    </span>
                </div>

                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))' }} />

                <style>{`
                    @keyframes invitationSubmitFadeIn {
                        from { opacity: 0; transform: translateY(8px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes invitationOrbitSpin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes invitationCorePulse {
                        0%, 100% { transform: scale(1); opacity: 0.7; }
                        50% { transform: scale(1.08); opacity: 1; }
                    }
                    @keyframes invitationProgressFill {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                    @keyframes invitationDots {
                        0% { opacity: 0.2; }
                        50% { opacity: 1; }
                        100% { opacity: 0.2; }
                    }
                    @keyframes invitationCheckPop {
                        from { opacity: 0; transform: scale(0.6); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes invitationCheckDraw {
                        from { opacity: 0; transform: scale(0.5); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
            </div>
        </div>
    )
}
