import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
} from 'react'
import gsap from 'gsap'
import type { BabyPhoto, PhotoGalleryData } from '../types/planet.types'

interface PhotoGalleryModalProps {
    isOpen: boolean
    onClose: () => void
    planetName: string
    photoGallery: PhotoGalleryData
}

const TAB_COLORS = ['#89C2D9', '#E8A0BF']
const SWIPE_THRESHOLD_RATIO = 0.18

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

function wrapIndex(index: number, length: number) {
    return (index + length) % length
}

export default function PhotoGalleryModal({
    isOpen,
    onClose,
    planetName,
    photoGallery,
}: PhotoGalleryModalProps) {
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const expandedRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const wasExpandedRef = useRef(false)
    const slideDirRef = useRef(0)
    const swipeHandledRef = useRef(false)
    const skipSlideAnimRef = useRef(false)
    const [showSwipeHint, setShowSwipeHint] = useState(false)

    const activeTab = photoGallery.tabs[activeTabIndex] ?? photoGallery.tabs[0]
    const activePhotos = activeTab?.photos ?? []
    const isExpanded = selectedIndex !== null
    const selectedPhoto = selectedIndex !== null ? activePhotos[selectedIndex] : null
    const hasMultiplePhotos = activePhotos.length > 1

    const getCenterOffset = useCallback(() => {
        return -(viewportRef.current?.clientWidth ?? 0)
    }, [])

    const resetTrackPosition = useCallback(() => {
        gsap.set(trackRef.current, { x: getCenterOffset() })
    }, [getCenterOffset])

    const animateTrackTo = useCallback(
        (targetX: number, onComplete?: () => void) => {
            gsap.to(trackRef.current, {
                x: targetX,
                duration: 0.32,
                ease: 'power2.out',
                onComplete,
            })
        },
        [],
    )

    const goPrev = useCallback(() => {
        slideDirRef.current = -1
        setSelectedIndex((i) =>
            i === null ? null : wrapIndex(i - 1, activePhotos.length),
        )
    }, [activePhotos.length])

    const goNext = useCallback(() => {
        slideDirRef.current = 1
        setSelectedIndex((i) =>
            i === null ? null : wrapIndex(i + 1, activePhotos.length),
        )
    }, [activePhotos.length])

    const dismissSwipeHint = useCallback(() => setShowSwipeHint(false), [])

    const commitSwipe = useCallback(
        (direction: -1 | 1) => {
            if (selectedIndex === null) return
            const width = viewportRef.current?.clientWidth ?? 0
            const center = -width
            skipSlideAnimRef.current = true
            swipeHandledRef.current = true
            setShowSwipeHint(false)

            animateTrackTo(center - direction * width, () => {
                slideDirRef.current = direction
                setSelectedIndex(wrapIndex(selectedIndex + direction, activePhotos.length))
            })
        },
        [activePhotos.length, animateTrackTo, selectedIndex],
    )

    const selectTab = useCallback((index: number) => {
        setActiveTabIndex(index)
        setSelectedIndex(null)
        wasExpandedRef.current = false
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setActiveTabIndex(0)
            setSelectedIndex(null)
            wasExpandedRef.current = false
            setShowSwipeHint(false)
        }
    }, [isOpen])

    useEffect(() => {
        if (selectedIndex === null || !hasMultiplePhotos) {
            setShowSwipeHint(false)
            return
        }

        const isMobile = window.matchMedia('(max-width: 640px)').matches
        if (!isMobile) {
            setShowSwipeHint(false)
            return
        }

        setShowSwipeHint(true)
        const timer = window.setTimeout(() => setShowSwipeHint(false), 6000)
        return () => window.clearTimeout(timer)
    }, [selectedIndex, hasMultiplePhotos, activeTabIndex])

    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport || selectedIndex === null || !hasMultiplePhotos) return

        let startX = 0
        let startY = 0
        let dragging = false

        const onStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX
            startY = e.touches[0].clientY
            dragging = false
            swipeHandledRef.current = false
            gsap.killTweensOf(trackRef.current)
        }

        const onMove = (e: TouchEvent) => {
            const dx = e.touches[0].clientX - startX
            const dy = e.touches[0].clientY - startY

            if (!dragging) {
                if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy)) return
                dragging = true
                dismissSwipeHint()
            }

            e.preventDefault()
            gsap.set(trackRef.current, { x: getCenterOffset() + dx })
        }

        const onEnd = (e: TouchEvent) => {
            if (!dragging) return

            const dx = e.changedTouches[0].clientX - startX
            const width = viewport.clientWidth
            const threshold = width * SWIPE_THRESHOLD_RATIO
            const center = getCenterOffset()

            if (dx < -threshold) {
                commitSwipe(1)
            } else if (dx > threshold) {
                commitSwipe(-1)
            } else {
                animateTrackTo(center)
            }

            dragging = false
        }

        viewport.addEventListener('touchstart', onStart, { passive: true })
        viewport.addEventListener('touchmove', onMove, { passive: false })
        viewport.addEventListener('touchend', onEnd, { passive: true })
        viewport.addEventListener('touchcancel', onEnd, { passive: true })

        return () => {
            viewport.removeEventListener('touchstart', onStart)
            viewport.removeEventListener('touchmove', onMove)
            viewport.removeEventListener('touchend', onEnd)
            viewport.removeEventListener('touchcancel', onEnd)
        }
    }, [
        selectedIndex,
        hasMultiplePhotos,
        activeTabIndex,
        getCenterOffset,
        animateTrackTo,
        commitSwipe,
        dismissSwipeHint,
    ])

    useLayoutEffect(() => {
        if (selectedIndex === null || !hasMultiplePhotos) return

        if (skipSlideAnimRef.current) {
            skipSlideAnimRef.current = false
            resetTrackPosition()
            return
        }

        resetTrackPosition()
    }, [selectedIndex, activeTabIndex, hasMultiplePhotos, resetTrackPosition])

    useLayoutEffect(() => {
        if (selectedIndex === null) {
            wasExpandedRef.current = false
            return
        }

        const root = expandedRef.current
        if (!root) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const toolbar = root.querySelector<HTMLElement>('.photo-gallery-expanded-toolbar')
        const viewport = root.querySelector<HTMLElement>('.photo-gallery-swipe-viewport')
        const hint = root.querySelector<HTMLElement>('.photo-gallery-swipe-hint')
        const caption = root.querySelector<HTMLElement>('.photo-gallery-expanded-caption')
        const prevBtn = root.querySelector<HTMLElement>('.photo-gallery-expanded-nav--prev')
        const nextBtn = root.querySelector<HTMLElement>('.photo-gallery-expanded-nav--next')

        if (reducedMotion) {
            gsap.set([root, toolbar, viewport, hint, caption, prevBtn, nextBtn].filter(Boolean), {
                clearProps: 'all',
                opacity: 1,
            })
            resetTrackPosition()
            return
        }

        if (!wasExpandedRef.current) {
            wasExpandedRef.current = true
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
            tl.from(root, { opacity: 0, duration: 0.28 })
            if (toolbar) tl.from(toolbar, { y: -18, opacity: 0, duration: 0.38 }, 0.06)
            if (viewport) tl.from(viewport, { scale: 0.92, opacity: 0, duration: 0.5 }, 0.1)
            if (hint) tl.from(hint, { y: 8, opacity: 0, duration: 0.28 }, 0.2)
            if (caption) tl.from(caption, { y: 8, opacity: 0, duration: 0.28 }, 0.22)
            if (prevBtn) tl.from(prevBtn, { opacity: 0, duration: 0.28 }, 0.18)
            if (nextBtn) tl.from(nextBtn, { opacity: 0, duration: 0.28 }, 0.18)
            return
        }

        if (skipSlideAnimRef.current || !hasMultiplePhotos) return

        const width = viewportRef.current?.clientWidth ?? 0
        const center = -width
        const dir = slideDirRef.current
        gsap.fromTo(
            trackRef.current,
            { x: center - dir * 40 },
            { x: center, duration: 0.34, ease: 'power2.out' },
        )
    }, [selectedIndex, activeTabIndex, hasMultiplePhotos, resetTrackPosition])

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
                setSelectedIndex((i) => (i === null ? 0 : wrapIndex(i + 1, activePhotos.length)))
            } else if (e.key === 'ArrowLeft') {
                slideDirRef.current = -1
                setSelectedIndex((i) =>
                    i === null ? 0 : wrapIndex(i - 1, activePhotos.length),
                )
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, onClose, selectedIndex, activePhotos.length])

    const handleStageClick = useCallback(() => {
        if (swipeHandledRef.current) {
            swipeHandledRef.current = false
            return
        }
        setSelectedIndex(null)
    }, [])

    if (!isOpen || !activeTab) return null

    const openPhoto = (index: number) => {
        if (selectedIndex !== null) {
            slideDirRef.current = index > selectedIndex ? 1 : -1
        } else {
            slideDirRef.current = 0
        }
        setSelectedIndex(index)
    }

    const renderSwipeSlide = (photo: BabyPhoto, key: string) => (
        <div key={key} className="photo-gallery-swipe-slide">
            <img
                src={photo.src}
                alt={photo.alt ?? 'Gallery photo'}
                className="photo-gallery-expanded-img"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )

    const tabBar = (
        <div className="photo-gallery-tabs">
            {photoGallery.tabs.map((tab, index) => {
                const color = TAB_COLORS[index % TAB_COLORS.length]
                const isActive = index === activeTabIndex
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => selectTab(index)}
                        className="photo-gallery-tab"
                        style={{
                            color: isActive ? '#F4FAFF' : 'rgba(205,239,253,0.65)',
                            background: isActive ? `${color}33` : 'rgba(167,216,245,0.05)',
                            borderColor: isActive ? color : 'rgba(167,216,245,0.2)',
                            boxShadow: isActive ? `0 0 12px ${color}44` : 'none',
                        }}
                    >
                        <span
                            className="photo-gallery-tab-dot"
                            style={{
                                background: color,
                                boxShadow: isActive ? `0 0 6px ${color}` : 'none',
                            }}
                        />
                        {tab.label}
                        <span className="photo-gallery-tab-count">{tab.photos.length}</span>
                    </button>
                )
            })}
        </div>
    )

    const prevPhoto = selectedIndex !== null
        ? activePhotos[wrapIndex(selectedIndex - 1, activePhotos.length)]
        : null
    const nextPhoto = selectedIndex !== null
        ? activePhotos[wrapIndex(selectedIndex + 1, activePhotos.length)]
        : null

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
                                ← Back to {activeTab.label}
                            </button>
                            <span className="photo-gallery-expanded-count">
                                {activeTab.label} · {selectedIndex + 1} / {activePhotos.length}
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

                        {hasMultiplePhotos && (
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
                            onClick={handleStageClick}
                            role="presentation"
                        >
                            {hasMultiplePhotos && prevPhoto && nextPhoto ? (
                                <div ref={viewportRef} className="photo-gallery-swipe-viewport">
                                    <div ref={trackRef} className="photo-gallery-swipe-track">
                                        {renderSwipeSlide(prevPhoto, `prev-${prevPhoto.src}`)}
                                        {renderSwipeSlide(selectedPhoto, `current-${selectedPhoto.src}`)}
                                        {renderSwipeSlide(nextPhoto, `next-${nextPhoto.src}`)}
                                    </div>
                                </div>
                            ) : (
                                <div className="photo-gallery-single-view">
                                    <img
                                        src={selectedPhoto.src}
                                        alt={selectedPhoto.alt ?? `Gallery photo ${selectedIndex + 1}`}
                                        className="photo-gallery-expanded-img"
                                        draggable={false}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}

                            {selectedPhoto.alt && (
                                <p className="photo-gallery-expanded-caption">{selectedPhoto.alt}</p>
                            )}

                            {hasMultiplePhotos && showSwipeHint && (
                                <p className="photo-gallery-swipe-hint" aria-live="polite">
                                    Swipe left or right to check other pictures
                                </p>
                            )}
                        </div>

                        {hasMultiplePhotos && (
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

                        {tabBar}

                        <div
                            key={activeTab.id}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '1.25rem',
                                minHeight: 0,
                            }}
                        >
                            <div className="photo-gallery-mosaic">
                                {activePhotos.map((photo, i) => (
                                    <button
                                        key={`${activeTab.id}-${photo.src}-${i}`}
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
                                Solar Explorer · {activeTab.label} Archive
                            </span>
                            <span style={{
                                fontFamily: "'Syne', sans-serif",
                                fontSize: '0.7rem',
                                color: 'rgba(205,239,253,0.6)',
                                letterSpacing: '0.05em',
                            }}>
                                {activePhotos.length} photos
                            </span>
                        </div>
                    </>
                )}

                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(167,216,245,0.15))' }} />
            </div>
        </div>
    )
}
