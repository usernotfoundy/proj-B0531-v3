import { lazy, Suspense, useState, useRef } from 'react'
import SpaceCanvas from './components/SpaceCanvas'
import SplashScreen from './components/SplashScreen'
import ScrollContainer from './components/ScrollContainer'
import { useSpaceScene } from './hooks/useSpaceScene'
import type { GodparentsData, HealthProtocolsData } from './types/planet.types'

const HUD = lazy(() => import('./components/HUD'))
const PlanetPanel = lazy(() => import('./components/PlanetPanel'))
const CoordinatesModal = lazy(() => import('./components/CoordinatesModal'))
const GodparentsModal = lazy(() => import('./components/GodparentsModal'))
const HealthProtocolsModal = lazy(() => import('./components/HealthProtocolsModal'))

interface CoordinatesData {
  latitude: number
  longitude: number
  planetName: string
  description?: string
}

interface GodparentsModalData {
  planetName: string
  description?: string
  godparents: GodparentsData
}

interface HealthProtocolsModalData {
  planetName: string
  healthProtocols: HealthProtocolsData
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { spaceshipRef } = useSpaceScene(canvasRef)
  const [splashDone, setSplashDone] = useState(false)
  const [coordinatesModal, setCoordinatesModal] = useState<CoordinatesData | null>(null)
  const [godparentsModal, setGodparentsModal] = useState<GodparentsModalData | null>(null)
  const [healthProtocolsModal, setHealthProtocolsModal] = useState<HealthProtocolsModalData | null>(null)

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
          <PlanetPanel
            onShowCoordinates={setCoordinatesModal}
            onShowGodparents={setGodparentsModal}
            onShowHealthProtocols={setHealthProtocolsModal}
          />
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
      {godparentsModal && (
        <Suspense fallback={null}>
          <GodparentsModal
            isOpen={!!godparentsModal}
            onClose={() => setGodparentsModal(null)}
            planetName={godparentsModal.planetName}
            description={godparentsModal.description}
            godparents={godparentsModal.godparents}
          />
        </Suspense>
      )}
      {healthProtocolsModal && (
        <Suspense fallback={null}>
          <HealthProtocolsModal
            isOpen={!!healthProtocolsModal}
            onClose={() => setHealthProtocolsModal(null)}
            planetName={healthProtocolsModal.planetName}
            healthProtocols={healthProtocolsModal.healthProtocols}
          />
        </Suspense>
      )}
    </>
  )
}
