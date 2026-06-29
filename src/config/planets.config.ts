import type { PlanetConfig } from '../types/planet.types'
import { BABY_PHOTO_GALLERY, totalArchivePhotos } from './babyPhotos.config'
import { GODPARENTS } from './godparents.config'
import { HEALTH_PROTOCOLS } from './healthProtocols.config'
import { INVITATION } from './invitation.config'
import { LAUNCH_PROGRAMME } from './launchProgramme.config'

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
            { label: 'Stardate', value: 'August 29th, 2026', unit: 'Saturday' },
            { label: 'T-Minus Zero', value: '12:30 PM', unit: 'AST (Arrival Standard Time)' },
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
        description: LAUNCH_PROGRAMME.reminders,
        launchProgramme: LAUNCH_PROGRAMME,
        button: { label: 'VIEW PROGRAMME' },
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
            { label: 'Memories', value: String(totalArchivePhotos(BABY_PHOTO_GALLERY)), unit: 'PHOTOS' },
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
    {
        id: 'pluto',
        name: 'PLUTO',
        modelPath: '/models/pluto.glb',
        position: [30, -5, -900],
        displaySize: 22,
        rotationSpeed: 0.001,
        description: 'The outermost checkpoint on this mission. Thank you for joining us on this journey.',
        facts: [
            { label: 'Status', value: 'Complete', unit: 'MISSION' },
            { label: 'Checkpoint', value: 'Final', unit: 'WAYPOINT' },
            { label: 'Orbit', value: '248', unit: 'YEARS' },
            { label: 'Moons', value: '5', unit: 'KNOWN' },
        ],
    },
]