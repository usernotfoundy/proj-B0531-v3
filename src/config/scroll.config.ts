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
