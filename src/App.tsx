import { lazy, Suspense, useState, useRef } from 'react'
import SpaceCanvas from './components/SpaceCanvas'
import SplashScreen from './components/SplashScreen'
import ScrollContainer from './components/ScrollContainer'
import { useSpaceScene } from './hooks/useSpaceScene'
import { PLANETS } from './config/planets.config'
import type { GodparentsData, HealthProtocolsData, InvitationData, LaunchProgrammeData, LocationCoordinate, PhotoGalleryData } from './types/planet.types'

const HUD = lazy(() => import('./components/HUD'))
const PlanetPanel = lazy(() => import('./components/PlanetPanel'))
const CoordinatesModal = lazy(() => import('./components/CoordinatesModal'))
const GodparentsModal = lazy(() => import('./components/GodparentsModal'))
const HealthProtocolsModal = lazy(() => import('./components/HealthProtocolsModal'))
const PhotoGalleryModal = lazy(() => import('./components/PhotoGalleryModal'))
const InvitationModal = lazy(() => import('./components/InvitationModal'))
const LaunchProgrammeModal = lazy(() => import('./components/LaunchProgrammeModal'))

interface CoordinatesData {
  planetName: string
  description?: string
  locations: LocationCoordinate[]
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

interface PhotoGalleryModalData {
  planetName: string
  photoGallery: PhotoGalleryData
}

interface InvitationModalData {
  planetName: string
  invitation: InvitationData
}

interface LaunchProgrammeModalData {
  planetName: string
  launchProgramme: LaunchProgrammeData
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { spaceshipRef } = useSpaceScene(canvasRef)
  const [splashDone, setSplashDone] = useState(false)
  const [coordinatesModal, setCoordinatesModal] = useState<CoordinatesData | null>(null)
  const [godparentsModal, setGodparentsModal] = useState<GodparentsModalData | null>(null)
  const [healthProtocolsModal, setHealthProtocolsModal] = useState<HealthProtocolsModalData | null>(null)
  const [photoGalleryModal, setPhotoGalleryModal] = useState<PhotoGalleryModalData | null>(null)
  const [invitationModal, setInvitationModal] = useState<InvitationModalData | null>(null)
  const [launchProgrammeModal, setLaunchProgrammeModal] = useState<LaunchProgrammeModalData | null>(null)

  return (
    <>
      <SpaceCanvas canvasRef={canvasRef} />

      <div className="relative" style={{ zIndex: 1 }}>
        <ScrollContainer key={PLANETS.length} />
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
            onShowPhotoGallery={setPhotoGalleryModal}
            onShowInvitation={setInvitationModal}
            onShowLaunchProgramme={setLaunchProgrammeModal}
          />
        </Suspense>
      )}

      {coordinatesModal && (
        <Suspense fallback={null}>
          <CoordinatesModal
            isOpen={!!coordinatesModal}
            onClose={() => setCoordinatesModal(null)}
            planetName={coordinatesModal.planetName}
            description={coordinatesModal.description}
            locations={coordinatesModal.locations}
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
      {photoGalleryModal && (
        <Suspense fallback={null}>
          <PhotoGalleryModal
            isOpen={!!photoGalleryModal}
            onClose={() => setPhotoGalleryModal(null)}
            planetName={photoGalleryModal.planetName}
            photoGallery={photoGalleryModal.photoGallery}
          />
        </Suspense>
      )}
      {invitationModal && (
        <Suspense fallback={null}>
          <InvitationModal
            isOpen={!!invitationModal}
            onClose={() => setInvitationModal(null)}
            planetName={invitationModal.planetName}
            invitation={invitationModal.invitation}
          />
        </Suspense>
      )}
      {launchProgrammeModal && (
        <Suspense fallback={null}>
          <LaunchProgrammeModal
            isOpen={!!launchProgrammeModal}
            onClose={() => setLaunchProgrammeModal(null)}
            planetName={launchProgrammeModal.planetName}
            launchProgramme={launchProgrammeModal.launchProgramme}
          />
        </Suspense>
      )}
    </>
  )
}
