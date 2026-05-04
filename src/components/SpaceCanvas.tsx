import { useRef } from 'react'
import { useSpaceScene } from '../hooks/useSpaceScene'

export default function SpaceCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useSpaceScene(canvasRef)

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'block',
                zIndex: 0,
            }}
        />
    )
}