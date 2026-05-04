import SpaceCanvas from './components/SpaceCanvas'
import ScrollContainer from './components/ScrollContainer'
import HUD from './components/HUD'
import PlanetPanel from './components/PlanetPanel'

export default function App() {
  return (
    <>
      <SpaceCanvas />

      <div className="relative" style={{ zIndex: 1 }}>
        <ScrollContainer />
      </div>

      <HUD />
      <PlanetPanel />
    </>
  )
}