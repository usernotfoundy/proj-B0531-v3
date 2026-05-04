import { useState, useRef } from 'react'
import SpaceCanvas from './components/SpaceCanvas'
import HUD from './components/HUD'
import PlanetPanel from './components/PlanetPanel'
import SplashScreen from './components/SplashScreen'
import ScrollContainer from './components/ScrollContainer'
import { useSpaceScene } from './hooks/useSpaceScene'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { spaceshipRef } = useSpaceScene(canvasRef)
  const [splashDone, setSplashDone] = useState(false)

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
          <PlanetPanel />
        </>
      )}
    </>
  )
}