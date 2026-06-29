import { useEffect, useState } from 'react'
import type { EntranceGroup, LaunchProgrammeData } from '../types/planet.types'

interface LaunchProgrammeModalProps {
    isOpen: boolean
    onClose: () => void
    planetName: string
    launchProgramme: LaunchProgrammeData
}

function NameListPanel({
    group,
    onBack,
}: {
    group: EntranceGroup
    onBack: () => void
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
                onClick={onBack}
                style={{
                    alignSelf: 'flex-start',
                    padding: '0.4rem 0.65rem',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '0.55rem',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    color: '#89C2D9',
                    backgroundColor: 'rgba(167,216,245,0.05)',
                    border: '1px solid rgba(167,216,245,0.2)',
                    borderRadius: '1px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                }}
            >
                ← Back to Programme
            </button>

            <div>
                <p style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    color: '#89C2D9',
                    textTransform: 'uppercase',
                    margin: 0,
                    marginBottom: '0.25rem',
                }}>
                    {group.label}
                </p>
                <p style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '0.7rem',
                    color: 'rgba(205,239,253,0.55)',
                    margin: 0,
                }}>
                    {group.names.length} participants
                </p>
            </div>

            <ol style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.15rem',
            }}>
                {group.names.map((name, i) => (
                    <li
                        key={`${group.id}-${name}-${i}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.55rem 0.65rem',
                            borderBottom: '1px solid rgba(167,216,245,0.08)',
                            animation: 'statReveal 0.4s ease forwards',
                            animationDelay: `${0.05 + i * 0.03}s`,
                            opacity: 0,
                        }}
                    >
                        <span style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '0.5rem',
                            letterSpacing: '0.1em',
                            color: 'rgba(137,194,217,0.5)',
                            minWidth: '1.25rem',
                        }}>
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <span style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#F4FAFF',
                        }}>
                            {name}
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default function LaunchProgrammeModal({
    isOpen,
    onClose,
    planetName,
    launchProgramme,
}: LaunchProgrammeModalProps) {
    const [activeGroup, setActiveGroup] = useState<EntranceGroup | null>(null)

    useEffect(() => {
        if (!isOpen) {
            setActiveGroup(null)
            return
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (activeGroup) {
                    setActiveGroup(null)
                } else {
                    onClose()
                }
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose, activeGroup])

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
                            {activeGroup ? activeGroup.label : launchProgramme.title}
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
                    minHeight: 0,
                }}>
                    {activeGroup ? (
                        <NameListPanel group={activeGroup} onBack={() => setActiveGroup(null)} />
                    ) : (
                        <ol style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}>
                            {launchProgramme.items.map((item, i) => (
                                <li
                                    key={item.title}
                                    style={{
                                        padding: '0.85rem 1rem',
                                        border: '1px solid rgba(167,216,245,0.12)',
                                        borderLeft: '3px solid #A7D8F5',
                                        background: 'rgba(167,216,245,0.04)',
                                        animation: 'statReveal 0.4s ease forwards',
                                        animationDelay: `${0.05 + i * 0.06}s`,
                                        opacity: 0,
                                    }}
                                >
                                    <p style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        fontSize: '0.62rem',
                                        letterSpacing: '0.08em',
                                        color: '#F4FAFF',
                                        textTransform: 'uppercase',
                                        margin: 0,
                                        marginBottom: item.entranceGroups ? '0.75rem' : 0,
                                        lineHeight: 1.5,
                                    }}>
                                        {i + 1}. {item.title}
                                    </p>

                                    {item.entranceGroups && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem',
                                        }}>
                                            {item.entranceGroups.map((group) => (
                                                <button
                                                    key={group.id}
                                                    onClick={() => setActiveGroup(group)}
                                                    style={{
                                                        padding: '0.45rem 0.65rem',
                                                        fontFamily: "'Orbitron', sans-serif",
                                                        fontSize: '0.5rem',
                                                        letterSpacing: '0.1em',
                                                        fontWeight: 700,
                                                        color: '#A7D8F5',
                                                        backgroundColor: 'rgba(167,216,245,0.08)',
                                                        border: '1px solid rgba(167,216,245,0.25)',
                                                        borderRadius: '1px',
                                                        cursor: 'pointer',
                                                        textTransform: 'uppercase',
                                                        transition: 'all 0.3s ease',
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
                                                    View {group.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    )}
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
                        Solar Explorer · Event Schedule
                    </span>
                    <span style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '0.7rem',
                        color: 'rgba(205,239,253,0.6)',
                        letterSpacing: '0.05em',
                    }}>
                        Christening · {launchProgramme.christeningTime}
                    </span>
                </div>

                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))' }} />
            </div>
        </div>
    )
}
