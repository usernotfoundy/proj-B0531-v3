import { TOTAL_SCROLL_VH, SCROLL_CONTAINER_ID } from '../config/scroll.config'

export { TOTAL_SCROLL_VH, SCROLL_CONTAINER_ID }

export default function ScrollContainer({
    children,
}: {
    children?: React.ReactNode
}) {
    return (
        <div
            id={SCROLL_CONTAINER_ID}
            style={{ height: `${TOTAL_SCROLL_VH}vh` }}
            className="relative w-full"
        >
            {children}
        </div>
    )
}
