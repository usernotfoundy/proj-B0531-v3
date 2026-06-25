import type { HealthProtocolsData } from '../types/planet.types'

export const HEALTH_PROTOCOLS: HealthProtocolsData = {
    title: 'Health Protocols',
    intro:
        "We kindly ask for your love and cooperation in following the health protocols, as we do our best to protect our little one's growing immune system.",
    protocols: [
        {
            icon: 'no-kiss',
            title: 'No Kissing Xyz',
            detail: 'Please refrain from kissing the baby to help keep their immune system safe.',
        },
        {
            icon: 'no-smoking',
            title: 'Strictly NO SMOKING OR VAPING',
            detail: 'This includes cigarettes, e-cigarettes, and vape devices — at all times during the event.',
        },
        {
            icon: 'sanitize',
            title: 'ALWAYS SANITIZE YOUR HANDS BEFORE TOUCHING Xyz',
            detail: 'Hand sanitizer will be available at the entrance. Please sanitize before holding or interacting with the baby.',
        },
        {
            icon: 'facemask',
            title: "WEAR FACEMASK OR YOU CAN JUST STAY AT HOME IF YOU'RE FEELING SICK",
            detail: 'If you are experiencing any symptoms, we kindly ask you to skip the event to keep everyone safe.',
        },
    ],
}
