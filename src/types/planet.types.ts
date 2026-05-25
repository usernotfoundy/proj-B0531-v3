export interface PlanetFact {
    label: string
    value: string
    unit?: string
}

export interface PlanetButton {
    label: string
    action?: string
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
    button?: PlanetButton
    coordinates?: {
        latitude: number
        longitude: number
        description?: string
    }
}

export interface CameraWaypoint {
    position: [number, number, number]
    lookAt: [number, number, number]
}