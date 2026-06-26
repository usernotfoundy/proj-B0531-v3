export interface PlanetFact {
    label: string
    value: string
    unit?: string
}

export interface GodparentEntry {
    title: string
    name: string
}

export interface GodparentsData {
    godmothers: GodparentEntry[]
    godfathers: GodparentEntry[]
}

export interface HealthProtocolItem {
    title: string
    detail?: string
    icon: 'no-kiss' | 'no-smoking' | 'sanitize' | 'facemask'
}

export interface HealthProtocolsData {
    title: string
    intro: string
    protocols: HealthProtocolItem[]
}

export interface BabyPhoto {
    /** URL or path under public/ (e.g. /babies/photo-01.jpg) */
    src: string
    alt?: string
    colSpan: number
    rowSpan: number
}

export interface PhotoGalleryData {
    eyebrow?: string
    title: string
    subtitle: string
    photos: BabyPhoto[]
}

export interface InvitationData {
    title: string
    subtitle: string
}

export interface PlanetButton {
    label: string
    action?: string
}

export interface LocationCoordinate {
    label: string
    latitude: number
    longitude: number
    mapsUrl?: string
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
        description?: string
        locations: LocationCoordinate[]
    }
    godparents?: GodparentsData
    healthProtocols?: HealthProtocolsData
    photoGallery?: PhotoGalleryData
    invitation?: InvitationData
}

export interface CameraWaypoint {
    position: [number, number, number]
    lookAt: [number, number, number]
}