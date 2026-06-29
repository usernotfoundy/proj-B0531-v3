import type { LaunchProgrammeData } from '../types/planet.types'

export const LAUNCH_PROGRAMME: LaunchProgrammeData = {
    reminders:
        'Below are the scheduled events for the launch day. Stay tuned for updates as we approach the launch date.',
    christeningTime: '1:00 PM',
    title: 'Launch Day Programme',
    items: [
        { title: 'Introduction of Baby Xyz' },
        {
            title: 'Entrance of the 12 diapers, 12 flowers, 12 pacifiers',
            entranceGroups: [
                {
                    id: 'diapers',
                    label: '12 Diapers',
                    names: [
                        'TBD 1', 'TBD 2', 'TBD 3', 'TBD 4',
                        'TBD 5', 'TBD 6', 'TBD 7', 'TBD 8',
                        'TBD 9', 'TBD 10', 'TBD 11', 'TBD 12',
                    ],
                },
                {
                    id: 'flowers',
                    label: '12 Flowers',
                    names: [
                        'TBD 1', 'TBD 2', 'TBD 3', 'TBD 4',
                        'TBD 5', 'TBD 6', 'TBD 7', 'TBD 8',
                        'TBD 9', 'TBD 10', 'TBD 11', 'TBD 12',
                    ],
                },
                {
                    id: 'pacifiers',
                    label: '12 Pacifiers',
                    names: [
                        'TBD 1', 'TBD 2', 'TBD 3', 'TBD 4',
                        'TBD 5', 'TBD 6', 'TBD 7', 'TBD 8',
                        'TBD 9', 'TBD 10', 'TBD 11', 'TBD 12',
                    ],
                },
            ],
        },
        { title: 'Souvenir Giving' },
        { title: 'Singing and Prayers for Baby Xyz' },
        { title: 'Dinner Time' },
    ],
}
