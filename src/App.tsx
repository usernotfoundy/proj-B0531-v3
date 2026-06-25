import { lazy, Suspense, useState, useRef } from 'react'
import SpaceCanvas from './components/SpaceCanvas'
import SplashScreen from './components/SplashScreen'
import ScrollContainer from './components/ScrollContainer'
import { useSpaceScene } from './hooks/useSpaceScene'

const HUD = lazy(() => import('./components/HUD'))
const PlanetPanel = lazy(() => import('./components/PlanetPanel'))
const CoordinatesModal = lazy(() => import('./components/CoordinatesModal'))

interface CoordinatesData {
  latitude: number
  longitude: number
  planetName: string
  description?: string
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { spaceshipRef } = useSpaceScene(canvasRef)
  const [splashDone, setSplashDone] = useState(false)
  const [coordinatesModal, setCoordinatesModal] = useState<CoordinatesData | null>(null)

  return (
    <>
      <SpaceCanvas canvasRef={canvasRef} />

      <div className="relative" style={{ zIndex: 1 }}>
        <ScrollContainer />
      </div>

      {!splashDone && (
        <SplashScreen
          spaceshipRef={spaceshipRef}
          onDismiss={() => setSplashDone(true)}
        />
      )}

      {splashDone && (
        <Suspense fallback={null}>
          <HUD />
          <PlanetPanel onShowCoordinates={setCoordinatesModal} />
        </Suspense>
      )}

      {coordinatesModal && (
        <Suspense fallback={null}>
          <CoordinatesModal
            isOpen={!!coordinatesModal}
            onClose={() => setCoordinatesModal(null)}
            planetName={coordinatesModal.planetName}
            latitude={coordinatesModal.latitude}
            longitude={coordinatesModal.longitude}
            description={coordinatesModal.description}
          />
        </Suspense>
      )}
    </>
  )
}
