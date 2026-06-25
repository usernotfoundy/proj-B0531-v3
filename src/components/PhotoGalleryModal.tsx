import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import type { PhotoGalleryData } from '../types/planet.types'
interface PhotoGalleryModalProps {
    isOpen: boolean
    onClose: () => void
    planetName: string
    photoGallery: PhotoGalleryData
}

const closeBtnStyle: CSSProperties = {
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
}

export default function PhotoGalleryModal({
    isOpen,
    onClose,
    planetName,
    photoGallery,
}: PhotoGalleryModalProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const isExpanded = selectedIndex !== null
    const selectedPhoto = selectedIndex !== null ? photoGallery.photos[selectedIndex] : null
    const expandedRef = useRef<HTMLDivElement>(null)
    const wasExpandedRef = useRef(false)
    const slideDirRef = useRef(0)

    useEffect(() => {
        if (!isOpen) setSelectedIndex(null)
    }, [isOpen])

    useLayoutEffect(() => {
        if (selectedIndex === null) {
            wasExpandedRef.current = false
            return
        }

        const root = expandedRef.current
        if (!root) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const img = root.querySelector<HTMLElement>('.photo-gallery-expanded-img')
        const toolbar = root.querySelector<HTMLElement>('.photo-gallery-expanded-toolbar')
        const caption = root.querySelector<HTMLElement>('.photo-gallery-expanded-caption')
        const prevBtn = root.querySelector<HTMLElement>('.photo-gallery-expanded-nav--prev')
        const nextBtn = root.querySelector<HTMLElement>('.photo-gallery-expanded-nav--next')

        if (!img) return

        if (reducedMotion) {
            gsap.set([root, toolbar, img, caption, prevBtn, nextBtn].filter(Boolean), {
                clearProps: 'all',
                opacity: 1,
            })
            return
        }

        if (!wasExpandedRef.current) {
            wasExpandedRef.current = true
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
            tl.from(root, { opacity: 0, duration: 0.28 })
            if (toolbar) tl.from(toolbar, { y: -18, opacity: 0, duration: 0.38 }, 0.06)
            tl.from(img, { scale: 0.82, opacity: 0, duration: 0.55 }, 0.1)
            if (caption) tl.from(caption, { y: 10, opacity: 0, duration: 0.32 }, 0.22)
            if (prevBtn) tl.from(prevBtn, { opacity: 0, duration: 0.28 }, 0.18)
            if (nextBtn) tl.from(nextBtn, { opacity: 0, duration: 0.28 }, 0.18)
        } else {
            const dir = slideDirRef.current
            gsap.fromTo(
                img,
                { opacity: 0, scale: 0.94, x: dir * 36 },
                { opacity: 1, scale: 1, x: 0, duration: 0.38, ease: 'power2.out' },
            )
            if (caption) {
                gsap.fromTo(caption, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' })
            }
        }
    }, [selectedIndex])

    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedIndex !== null) {
                    setSelectedIndex(null)
                } else {
                    onClose()
                }
                return
            }

            if (selectedIndex === null) return

            if (e.key === 'ArrowRight') {
                slideDirRef.current = 1
                setSelectedIndex((i) => (i === null ? 0 : (i + 1) % photoGallery.photos.length))
            } else if (e.key === 'ArrowLeft') {
                slideDirRef.current = -1
                setSelectedIndex((i) =>
                    i === null ? 0 : (i - 1 + photoGallery.photos.length) % photoGallery.photos.length,
                )
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose, selectedIndex, photoGallery.photos.length])

    if (!isOpen) return null

    const goPrev = () => {
        if (selectedIndex === null) return
        slideDirRef.current = -1
        setSelectedIndex((selectedIndex - 1 + photoGallery.photos.length) % photoGallery.photos.length)
    }

    const goNext = () => {
        if (selectedIndex === null) return
        slideDirRef.current = 1
        setSelectedIndex((selectedIndex + 1) % photoGallery.photos.length)
    }

    const openPhoto = (index: number) => {
        if (selectedIndex !== null) {
            slideDirRef.current = index > selectedIndex ? 1 : -1
        } else {
            slideDirRef.current = 0
        }
        setSelectedIndex(index)
    }

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
                    maxWidth: '960px',
                    height: '80vh',
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

                {isExpanded && selectedPhoto ? (
                    <div ref={expandedRef} className="photo-gallery-expanded">
                        <div className="photo-gallery-expanded-toolbar">
                            <button
                                type="button"
                                onClick={() => setSelectedIndex(null)}
                                className="photo-gallery-expanded-back"
                            >
                                ← Back to gallery
                            </button>
                            <span className="photo-gallery-expanded-count">
                                {selectedIndex + 1} / {photoGallery.photos.length}
                            </span>
                            <button
                                onClick={onClose}
                                aria-label="Close gallery"
                                style={closeBtnStyle}
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

                        {photoGallery.photos.length > 1 && (
                            <button
                                type="button"
                                className="photo-gallery-expanded-nav photo-gallery-expanded-nav--prev"
                                onClick={goPrev}
                                aria-label="Previous photo"
                            >
                                ‹
                            </button>
                        )}

                        <div
                            className="photo-gallery-expanded-stage"
                            onClick={() => setSelectedIndex(null)}
                            role="presentation"
                        >
                            <img
                                src={selectedPhoto.src}
                                alt={selectedPhoto.alt ?? `Gallery photo ${selectedIndex + 1}`}
                                className="photo-gallery-expanded-img"
                                draggable={false}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {selectedPhoto.alt && (
                                <p className="photo-gallery-expanded-caption">{selectedPhoto.alt}</p>
                            )}
                        </div>

                        {photoGallery.photos.length > 1 && (
                            <button
                                type="button"
                                className="photo-gallery-expanded-nav photo-gallery-expanded-nav--next"
                                onClick={goNext}
                                aria-label="Next photo"
                            >
                                ›
                            </button>
                        )}
                    </div>
                ) : (
                    <>
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
                                {photoGallery.eyebrow && (
                                    <p style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        fontSize: '0.45rem',
                                        letterSpacing: '0.25em',
                                        color: 'rgba(137,194,217,0.55)',
                                        textTransform: 'uppercase',
                                        margin: 0,
                                        marginBottom: '0.35rem',
                                    }}>
                                        {photoGallery.eyebrow}
                                    </p>
                                )}
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
                                    {photoGallery.subtitle}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                aria-label="Close gallery"
                                style={closeBtnStyle}
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
                            <div className="photo-gallery-mosaic">
                                {photoGallery.photos.map((photo, i) => (
                                    <button
                                        key={`${photo.src}-${i}`}
                                        type="button"
                                        className="photo-gallery-cell"
                                        aria-label={photo.alt ?? `View photo ${i + 1}`}
                                        style={{
                                            gridColumn: `span ${photo.colSpan}`,
                                            gridRow: `span ${photo.rowSpan}`,
                                            animationDelay: `${0.04 + i * 0.03}s`,
                                        }}
                                        onClick={() => openPhoto(i)}
                                    >
                                        <img
                                            src={photo.src}
                                            alt={photo.alt ?? `Gallery photo ${i + 1}`}
                                            loading="lazy"
                                            draggable={false}
                                        />
                                    </button>
                                ))}
                            </div>
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
                                Solar Explorer · Memory Archive
                            </span>
                            <span style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '0.7rem',
                                color: 'rgba(205,239,253,0.6)',
                                letterSpacing: '0.05em',
                            }}>
                                {photoGallery.photos.length} photos
                            </span>
                        </div>
                    </>
                )}

                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))' }} />
            </div>
        </div>
    )
}
