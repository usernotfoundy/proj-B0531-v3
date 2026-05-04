export interface PlanetFact {
    label: string
    value: string
    unit?: string
}

export interface PlanetConfig {
    id: string
    name: string
    modelPath: string
    position: [number, number, number]
    displaySize: number
    scale?: number
    rotationSpeed?: number
    facts?: PlanetFact[]
    description?: string
}

export interface CameraWaypoint {
    position: [number, number, number]
    lookAt: [number, number, number]
}