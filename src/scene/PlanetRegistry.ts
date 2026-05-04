import type { SceneManager } from './SceneManager'
import { Planet } from './Planet'
import { PLANETS } from '../config/planets.config'

export class PlanetRegistry {
    planets: Planet[] = []

    constructor(sceneManager: SceneManager) {
        this.planets = PLANETS.map(
            (config) => new Planet(config, sceneManager)
        )
        console.log(`[PlanetRegistry] spawned ${this.planets.length} planets`)
    }

    // Get a planet by its config id
    getById(id: string): Planet | undefined {
        return this.planets.find((p) => p.config.id === id)
    }

    // Returns all world positions — used by CameraPath to build waypoints
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