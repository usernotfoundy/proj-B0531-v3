import { useState, useRef } from 'react'
import SpaceCanvas from './components/SpaceCanvas'
import HUD from './components/HUD'
import PlanetPanel from './components/PlanetPanel'
import SplashScreen from './components/SplashScreen'
import ScrollContainer from './components/ScrollContainer'
import CoordinatesModal from './components/CoordinatesModal'
import { useSpaceScene } from './hooks/useSpaceScene'

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
        <>
          <HUD />
          <PlanetPanel onShowCoordinates={setCoordinatesModal} />
        </>
      )}

      {coordinatesModal && (
        <CoordinatesModal
          isOpen={!!coordinatesModal}
          onClose={() => setCoordinatesModal(null)}
          planetName={coordinatesModal.planetName}
          latitude={coordinatesModal.latitude}
          longitude={coordinatesModal.longitude}
          description={coordinatesModal.description}
        />
      )}
    </>
  )
}