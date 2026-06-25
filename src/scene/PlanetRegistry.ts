import type { SceneManager } from './SceneManager'
import { Planet } from './Planet'
import { PLANETS } from '../config/planets.config'

export class PlanetRegistry {
    planets: Planet[] = []

    constructor(sceneManager: SceneManager) {
        this.planets = PLANETS.map((config) => new Planet(config, sceneManager))

        // Only load the first planet on init — others load as user scrolls near them
        this.planets[0]?.load()
    }

    ensureNearbyLoaded(centerIndex: number) {
        const indices = new Set([
            centerIndex - 1,
            centerIndex,
            centerIndex + 1,
        ])

        for (const i of indices) {
            if (i >= 0 && i < this.planets.length) {
                this.planets[i].load()
            }
        }
    }

    getById(id: string): Planet | undefined {
        return this.planets.find((p) => p.config.id === id)
    }

    getAllPositions() {
        return this.planets.map((p) => ({
            id: p.config.id,
            name: p.config.name,
            position: p.getWorldPosition(),
        }))
    }

    dispose() {
        this.planets.forEach((p) => p.dispose())
    }
}
