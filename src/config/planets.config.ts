import type { PlanetConfig } from '../types/planet.types'
import { BABY_PHOTO_GALLERY } from './babyPhotos.config'
import { GODPARENTS } from './godparents.config'
import { HEALTH_PROTOCOLS } from './healthProtocols.config'
import { INVITATION } from './invitation.config'

export const PLANETS: PlanetConfig[] = [
    {
        id: 'earth',
        name: 'GODPARENTS',
        modelPath: '/models/earth.glb',
        position: [0, 0, 0],
        displaySize: 10,
        rotationSpeed: 0.002,
        description: 'Meet the specialized guardians overseeing this journey.',
        godparents: GODPARENTS,
        button: { label: 'VIEW CREW ROSTER' },
    },
    {
        id: 'mars',
        name: 'Mission Briefing',
        modelPath: '/models/mars.glb',
        position: [20, -8, -120],
        displaySize: 10,
        rotationSpeed: 0.0015,
        description: 'Launch Parameters',
        facts: [
            { label: 'Stardate', value: 'August 1st, 2026', unit: 'Saturday' },
            { label: 'T-Minus Zero', value: '11:00 AM', unit: 'AST (Arrival Standard Time)' },
            // { label: 'Day Length', value: '24.6', unit: 'hours' },
            // { label: 'Moons', value: '2' },
            // { label: 'Surface Temp', value: '-60', unit: '°C avg' },
            // { label: 'Gravity', value: '3.7', unit: 'm/s²' },
        ],
        button: { label: 'VIEW COORDINATES' },
        coordinates: {
            description: 'Mission Launch Coordinates',
            locations: [
                {
                    label: 'Christening',
                    latitude: 17.9262135,
                    longitude: 120.4757704,
                    mapsUrl: 'https://maps.app.goo.gl/MVE85qU9qumbE8VG6',
                },
                {
                    label: 'Venue',
                    latitude: 17.929862,
                    longitude: 120.4736457,
                    mapsUrl: 'https://maps.app.goo.gl/9CLv34U14kghzSAy6',
                },
            ],
        }
    },
    {
        id: 'jupiter',
        name: 'Launch Details',
        modelPath: '/models/jupiter.glb',
        position: [-25, 12, -260],
        displaySize: 10,
        rotationSpeed: 0.003,
        description: 'Below are the scheduled events for the launch day. Stay tuned for updates as we approach the launch date.',
        facts: [
            { label: 'Christening', value: '10:00', unit: 'AM' },
            { label: 'Eating', value: '12:00', unit: 'NOON' },
            // { label: 'Day Length', value: '9.9', unit: 'hours' },
            // { label: 'Moons', value: '95' },
            // { label: 'Surface Temp', value: '-110', unit: '°C avg' },
            // { label: 'Gravity', value: '24.8', unit: 'm/s²' },
        ],
        // button: { label: 'EXPLORE' },
    },
    {
        id: 'saturn',
        name: 'Mission Alerts',
        modelPath: '/models/saturn.glb',
        position: [30, -6, -400],
        displaySize: 30,
        rotationSpeed: 0.0018,
        description: HEALTH_PROTOCOLS.intro,
        facts: [
            { label: '01', value: 'No Kissing', unit: 'Xyz' },
            { label: '02', value: 'No Smoking', unit: 'OR VAPING' },
            { label: '03', value: 'Sanitize Hands', unit: 'BEFORE TOUCHING' },
            { label: '04', value: 'Wear Facemask', unit: 'OR STAY HOME' },
        ],
        healthProtocols: HEALTH_PROTOCOLS,
        button: { label: 'VIEW HEALTH PROTOCOLS' },
    },
    {
        id: 'uranus',
        name: 'The Archive',
        modelPath: '/models/uranus.glb',
        position: [-20, 10, -540],
        displaySize: 25,
        rotationSpeed: 0.0015,
        description: BABY_PHOTO_GALLERY.subtitle,
        facts: [
            { label: 'Memories', value: String(BABY_PHOTO_GALLERY.photos.length), unit: 'PHOTOS' },
            { label: 'Milestone', value: '1st', unit: 'BIRTHDAY' },
            { label: 'Orbit', value: '365', unit: 'DAYS' },
            { label: 'Theme', value: 'Baby', unit: 'SHOWCASE' },
        ],
        photoGallery: BABY_PHOTO_GALLERY,
        button: { label: 'VIEW GALLERY' },
    },
    {
        id: 'neptune',
        name: 'INVITATION',
        modelPath: '/models/neptune.glb',
        position: [25, -10, -680],
        displaySize: 25,
        rotationSpeed: 0.0012,
        description: INVITATION.subtitle,
        invitation: INVITATION,
        button: { label: 'RSVP' },
    },
]