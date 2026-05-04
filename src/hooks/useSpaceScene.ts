import { useEffect, useRef } from 'react'
import { SceneManager } from '../scene/SceneManager'
import { PlanetRegistry } from '../scene/PlanetRegistry'
import { CameraPath } from '../scene/CameraPath'
import { Sun } from '../scene/Sun'
import { Spaceship } from '../scene/Spaceship'

export function useSpaceScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    const sceneManagerRef = useRef<SceneManager | null>(null)
    const registryRef = useRef<PlanetRegistry | null>(null)
    const cameraPathRef = useRef<CameraPath | null>(null)
    const sunRef = useRef<Sun | null>(null)
    const spaceshipRef = useRef<Spaceship | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const sceneManager = new SceneManager(canvas)
        const sun = new Sun(sceneManager)
        const registry = new PlanetRegistry(sceneManager)
        const cameraPath = new CameraPath(sceneManager, registry)
        const spaceship = new Spaceship(sceneManager)

        sceneManagerRef.current = sceneManager
        sunRef.current = sun
        registryRef.current = registry
        cameraPathRef.current = cameraPath
        spaceshipRef.current = spaceship

        sceneManager.start()

        return () => {
            cameraPath.destroy()
            registry.dispose()
            sun.dispose()
            spaceship.dispose()
            sceneManager.destroy()
        }
    }, [])

    return { sceneManagerRef, registryRef, cameraPathRef, sunRef, spaceshipRef }
} 