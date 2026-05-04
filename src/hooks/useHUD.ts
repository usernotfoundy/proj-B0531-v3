import { useEffect, useState } from 'react'
import { PLANETS } from '../config/planets.config'
// import { TOTAL_SCROLL_VH } from '../components/ScrollContainer'

export interface HUDState {
    activePlanetIndex: number
    scrollProgress: number      // 0 → 1 across the full journey
    planetProgress: number      // 0 → 1 within the current planet's section
}

export function useHUD(): HUDState {
    const [state, setState] = useState<HUDState>({
        activePlanetIndex: 0,
        scrollProgress: 0,
        planetProgress: 0,
    })

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight

            if (totalHeight <= 0) return

            const scrollProgress = Math.min(scrolled / totalHeight, 1)

            // Each planet owns an equal slice of the total scroll
            const sliceSize = 1 / PLANETS.length
            const activePlanetIndex = Math.min(
                Math.floor(scrollProgress / sliceSize),
                PLANETS.length - 1
            )

            // How far through the current planet's slice (0 → 1)
            const sliceStart = activePlanetIndex * sliceSize
            const planetProgress = Math.min(
                (scrollProgress - sliceStart) / sliceSize,
                1
            )

            setState({ activePlanetIndex, scrollProgress, planetProgress })
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // run once on mount

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return state
}