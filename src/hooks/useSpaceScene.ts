import { useEffect, useRef } from 'react'
import { SceneManager } from '../scene/SceneManager'
import { PlanetRegistry } from '../scene/PlanetRegistry'
import { CameraPath } from '../scene/CameraPath'
import { Sun } from '../scene/Sun'

export function useSpaceScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    const sceneManagerRef = useRef<SceneManager | null>(null)
    const registryRef = useRef<PlanetRegistry | null>(null)
    const cameraPathRef = useRef<CameraPath | null>(null)
    const sunRef = useRef<Sun | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // ── Boot ────────────────────────────────────────────────────
        const sceneManager = new SceneManager(canvas)
        const sun = new Sun(sceneManager)
        const registry = new PlanetRegistry(sceneManager)
        const cameraPath = new CameraPath(sceneManager, registry)

        sceneManagerRef.current = sceneManager
        sunRef.current = sun
        registryRef.current = registry
        cameraPathRef.current = cameraPath

        sceneManager.start()

        // ── Teardown ────────────────────────────────────────────────
        return () => {
            cameraPath.destroy()
            registry.dispose()
            sun.dispose()
            sceneManager.destroy()
            sceneManagerRef.current = null
            sunRef.current = null
            registryRef.current = null
            cameraPathRef.current = null
        }
    }, [])

    return {
        sceneManagerRef,
        registryRef,
        cameraPathRef,
        sunRef,
    }
}