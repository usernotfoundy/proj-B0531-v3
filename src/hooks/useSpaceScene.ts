import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SceneManager } from '../scene/SceneManager'
import { PlanetRegistry } from '../scene/PlanetRegistry'
import { CameraPath } from '../scene/CameraPath'
import { Sun } from '../scene/Sun'
import { Spaceship } from '../scene/Spaceship'
import { PLANETS } from '../config/planets.config'

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
        const spaceship = new Spaceship(sceneManager)

        sceneManagerRef.current = sceneManager
        sunRef.current = sun
        registryRef.current = registry
        spaceshipRef.current = spaceship

        sceneManager.start()

        let cameraPath: CameraPath | null = null
        let cancelled = false
        let innerFrame = 0

        const outerFrame = requestAnimationFrame(() => {
            innerFrame = requestAnimationFrame(() => {
                if (cancelled) return
                cameraPath = new CameraPath(sceneManager, registry)
                cameraPathRef.current = cameraPath
                ScrollTrigger.refresh()
            })
        })

        const handleScroll = () => {
            const scrolled = window.scrollY
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            if (totalHeight <= 0) return

            const scrollProgress = Math.min(scrolled / totalHeight, 1)
            const sliceSize = 1 / PLANETS.length
            const activeIndex = Math.min(
                Math.floor(scrollProgress / sliceSize),
                PLANETS.length - 1
            )

            registry.ensureNearbyLoaded(activeIndex)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        const refreshScroll = () => ScrollTrigger.refresh()
        window.addEventListener('resize', refreshScroll)
        requestAnimationFrame(() => requestAnimationFrame(refreshScroll))

        return () => {
            cancelled = true
            cancelAnimationFrame(outerFrame)
            cancelAnimationFrame(innerFrame)
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', refreshScroll)
            cameraPath?.destroy()
            registry.dispose()
            sun.dispose()
            spaceship.dispose()
            sceneManager.destroy()
        }
    }, [PLANETS.length])

    return { sceneManagerRef, registryRef, cameraPathRef, sunRef, spaceshipRef }
}
