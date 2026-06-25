import { useEffect, type ReactNode } from 'react'
import type { HealthProtocolItem, HealthProtocolsData } from '../types/planet.types'

interface HealthProtocolsModalProps {
    isOpen: boolean
    onClose: () => void
    planetName: string
    healthProtocols: HealthProtocolsData
}

function ProtocolIcon({ icon }: { icon: HealthProtocolItem['icon'] }) {
    const stroke = '#A7D8F5'
    const fill = 'rgba(167,216,245,0.15)'

    const icons: Record<HealthProtocolItem['icon'], ReactNode> = {
        'no-kiss': (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="1.5" fill={fill} />
                <path d="M8.5 10.5c.8-1.2 2.2-1.8 3.5-1.5 1 .2 1.8.9 2.2 1.8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
                <path d="M7 7l10 10" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        'no-smoking': (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="1.5" fill={fill} />
                <rect x="5" y="11" width="9" height="2.5" rx="1" fill={stroke} opacity="0.7" />
                <path d="M14.5 12.2h2.5c.6 0 1 .4 1 1v.3" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
                <path d="M7 7l10 10" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        'sanitize': (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="1.5" fill={fill} />
                <path d="M10 8.5v2.2c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V8.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
                <path d="M9.5 8.5h5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
                <path d="M12 12.7v3.3" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="15.5" cy="7" r="1.2" fill="#89C2D9" opacity="0.9" />
                <circle cx="8.5" cy="9" r="0.8" fill="#89C2D9" opacity="0.7" />
            </svg>
        ),
        'facemask': (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="1.5" fill={fill} />
                <ellipse cx="12" cy="13.5" rx="5" ry="3.2" stroke={stroke} strokeWidth="1.4" fill="rgba(137,194,217,0.2)" />
                <path d="M7.5 13.5h9" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8.5 10.5c.8-.6 1.8-.9 3.5-.9s2.7.3 3.5.9" stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
        ),
    }

    return (
        <div style={{
            flexShrink: 0,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px',
            background: 'rgba(167,216,245,0.08)',
            border: '1px solid rgba(167,216,245,0.2)',
            boxShadow: '0 0 10px rgba(167,216,245,0.1)',
        }}>
            {icons[icon]}
        </div>
    )
}

export default function HealthProtocolsModal({
    isOpen,
    onClose,
    planetName,
    healthProtocols,
}: HealthProtocolsModalProps) {
    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose])

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
                    maxWidth: '560px',
                    maxHeight: '80vh',
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
                    flexShrink: 0,
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
                            {healthProtocols.title}
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

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    minHeight: 0,
                }}>
                    <p style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '0.8rem',
                        lineHeight: 1.75,
                        color: 'rgba(205,239,253,0.75)',
                        margin: 0,
                        fontWeight: 400,
                    }}>
                        {healthProtocols.intro}
                    </p>

                    <div style={{
                        height: '1px',
                        background: 'linear-gradient(to right, rgba(167,216,245,0.3), transparent)',
                    }} />

                    <ul style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        {healthProtocols.protocols.map((protocol, i) => (
                            <li
                                key={protocol.title}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.85rem',
                                    padding: '0.85rem 1rem',
                                    border: '1px solid rgba(167,216,245,0.12)',
                                    borderLeft: '3px solid #A7D8F5',
                                    background: 'rgba(167,216,245,0.04)',
                                    animation: 'statReveal 0.4s ease forwards',
                                    animationDelay: `${0.05 + i * 0.06}s`,
                                    opacity: 0,
                                }}
                            >
                                <ProtocolIcon icon={protocol.icon} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        fontSize: '0.62rem',
                                        letterSpacing: '0.08em',
                                        color: '#F4FAFF',
                                        textTransform: 'uppercase',
                                        margin: 0,
                                        marginBottom: protocol.detail ? '0.5rem' : 0,
                                        lineHeight: 1.5,
                                    }}>
                                        {protocol.title}
                                    </p>
                                    {protocol.detail && (
                                        <p style={{
                                            fontFamily: "'Syne', sans-serif",
                                            fontSize: '0.75rem',
                                            lineHeight: 1.6,
                                            color: 'rgba(205,239,253,0.6)',
                                            margin: 0,
                                        }}>
                                            {protocol.detail}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(to top, rgba(137,194,217,0.05), rgba(167,216,245,0.03))',
                    borderTop: '1px solid rgba(167,216,245,0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0,
                }}>
                    <span style={{
                        fontFamily: "'Orbitron', sans-serif",
                        fontSize: '0.4rem',
                        letterSpacing: '0.25em',
                        color: 'rgba(137,194,217,0.4)',
                        textTransform: 'uppercase',
                    }}>
                        Solar Explorer · Safety Briefing
                    </span>
                    <span style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '0.7rem',
                        color: 'rgba(205,239,253,0.6)',
                        letterSpacing: '0.05em',
                    }}>
                        {healthProtocols.protocols.length} protocols active
                    </span>
                </div>

                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))' }} />
            </div>
        </div>
    )
}
