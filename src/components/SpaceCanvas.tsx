interface Props {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export default function SpaceCanvas({ canvasRef }: Props) {
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