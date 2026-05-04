import { PLANETS } from '../config/planets.config'

// How many viewport heights each planet section takes
const VH_PER_PLANET = 150

export const TOTAL_SCROLL_VH = VH_PER_PLANET * PLANETS.length

export default function ScrollContainer({
    children,
}: {
    children?: React.ReactNode
}) {
    return (
        <div
            style={{ height: `${TOTAL_SCROLL_VH}vh` }}
            className="relative w-full"
        >
            {children}
        </div>
    )
}