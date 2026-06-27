import type { PhotoGalleryData } from '../types/planet.types'

/**
 * Google Drive share link → direct image URL for <img src>.
 * Paste the full share URL, or just the file ID.
 *
 * File must be shared as "Anyone with the link" can view.
 */
const driveImage = (shareUrlOrId: string, width = 1600) => {
    const match = shareUrlOrId.match(/\/d\/([a-zA-Z0-9_-]+)/)
    const id = match?.[1] ?? shareUrlOrId
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`
}

export function totalArchivePhotos(gallery: PhotoGalleryData): number {
    return gallery.tabs.reduce((count, tab) => count + tab.photos.length, 0)
}

export const BABY_PHOTO_GALLERY: PhotoGalleryData = {
    eyebrow: 'Our Stories',
    title: 'The Archive',
    subtitle: 'Captured moments from Xyz\'s first trip around the sun.',
    tabs: [
        {
            id: 'solo',
            label: 'Xyz',
            photos: [
                { 
                    src: driveImage('https://drive.google.com/file/d/1_Q6f-Y0sz4WmF97rSPP6VbDytwu70kGv/view?usp=sharing'), 
                    alt: 'Sweet smile', 
                    colSpan: 4, 
                    rowSpan: 3 
                },
                { 
                    src: driveImage('https://drive.google.com/file/d/11OEVEBQKa_3rVq9bXrFxgOm-4LPcnENU/view?usp=sharing'), 
                    alt: 'Little hands', 
                    colSpan: 2, 
                    rowSpan: 4 
                },
                { 
                    src: driveImage('https://drive.google.com/file/d/16w-SLBv1ptzLEUrey6fIvNc1ap-LpMVp/view?usp=sharing'), 
                    alt: 'Peek-a-boo', 
                    colSpan: 2, 
                    rowSpan: 2 
                },
                { 
                    src: driveImage('https://drive.google.com/file/d/1-guOTu95ikE_x3NgGxyBDntTLvY4oYV3/view?usp=sharing'), 
                    alt: 'Giggles', 
                    colSpan: 2, 
                    rowSpan: 2 
                },
                { 
                    src: driveImage('https://drive.google.com/file/d/1XEDb9FSTpXQguqCsgD79y-RgKNCoqf8w/view?usp=sharing'), 
                    alt: 'Cuteness Overload', 
                    colSpan: 2, 
                    rowSpan: 4
                },
                { 
                    src: driveImage('https://drive.google.com/file/d/1eDLBJb9wuNBeQHt6m7vdNKC2R3nGN4ZI/view?usp=sharing'), 
                    alt: 'Day 1', 
                    colSpan: 2, 
                    rowSpan: 3 
                },
                { 
                    src: driveImage('https://drive.google.com/file/d/1DG9p_zaPZMCacE_d8UU5PrnGUcxy-CR3/view?usp=sharing'), 
                    alt: 'Hep hep! Hooray!!', 
                    colSpan: 2, 
                    rowSpan: 3 
                },
            ],
        },
        {
            id: 'family',
            label: 'Family',
            photos: [
                {
                    src: driveImage('https://drive.google.com/file/d/1YmkeVmezLP6gOqDducX06jh1joql5_uP/view?usp=sharing'),
                    alt: 'Family moment',
                    colSpan: 4,
                    rowSpan: 3,
                },
                {   
                    src: driveImage('https://drive.google.com/file/d/1l9UGkwiEk9B4Uub2uSLr-5iOqDQXjnb1/view?usp=sharing'), 
                    alt: 'Together', 
                    colSpan: 2, 
                    rowSpan: 4 
                },
                {   
                    src: driveImage('https://drive.google.com/file/d/1gEZ2vTOW9yHiLOSUb2T8TMprPz94_1HU/view?usp=sharing'), 
                    alt: 'Growing together', 
                    colSpan: 2, 
                    rowSpan: 6
                },
                {   
                    src: driveImage('https://drive.google.com/file/d/1mgcfoYZRJ80bHnappEMt0i0GIEJCTLaK/view?usp=sharing'), 
                    alt: 'Cozy day', 
                    colSpan: 2, 
                    rowSpan: 6 
                },
                { 
                    src: driveImage('https://drive.google.com/file/d/18s31tMAdZSe2GsJNqH5xPekNAaDUgdWw/view?usp=sharing'), 
                    alt: 'Play time', 
                    colSpan: 2, 
                    rowSpan: 5 
                },
            ],
        },
        
    ],
}
