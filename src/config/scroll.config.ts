import { PLANETS } from './planets.config'

export const VH_PER_PLANET = 150
export const TOTAL_SCROLL_VH = VH_PER_PLANET * PLANETS.length
export const SCROLL_CONTAINER_ID = 'journey-scroll'

/** Scrollable distance in px (total content height minus one viewport). */
export function getMaxScrollPx(): number {
    return Math.max(
        0,
        window.innerHeight * (TOTAL_SCROLL_VH / 100 - 1)
    )
}

/** Scroll progress (0–1) that lands in the panel sweet spot for a planet slice. */
export function getPlanetScrollProgress(index: number): number {
    const clamped = Math.min(Math.max(index, 0), PLANETS.length - 1)
    const sliceSize = 1 / PLANETS.length
    const sliceStart = clamped * sliceSize
    const sweetSpot = clamped === 0 ? 0.45 : 0.68
    return sliceStart + sliceSize * sweetSpot
}

export function scrollToPlanet(index: number): void {
    const top = getPlanetScrollProgress(index) * getMaxScrollPx()
    window.scrollTo({ top, behavior: 'smooth' })
}
