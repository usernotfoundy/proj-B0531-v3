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
            id: 'family',
            label: 'Family',
            photos: [
                {
                    src: driveImage('https://drive.google.com/file/d/1YmkeVmezLP6gOqDducX06jh1joql5_uP/view?usp=sharing'),
                    alt: 'Family moment',
                    colSpan: 4,
                    rowSpan: 3,
                },
                {   src: driveImage('https://drive.google.com/file/d/1l9UGkwiEk9B4Uub2uSLr-5iOqDQXjnb1/view?usp=sharing'), 
                    alt: 'Together', 
                    colSpan: 2, 
                    rowSpan: 4 
                },
                { src: 'https://i.pinimg.com/736x/ad/b4/ca/adb4ca5f4e4b74bfa095660f6fba9cf5.jpg', alt: 'Growing together', colSpan: 2, rowSpan: 2 },
                { src: 'https://i.pinimg.com/1200x/b3/16/f0/b316f069f7b214e923f0960af5ea5db6.jpg', alt: 'Cozy day', colSpan: 2, rowSpan: 2 },
                { src: 'https://i.pinimg.com/736x/c9/e6/64/c9e664d0f811cf2995465e76ec594263.jpg', alt: 'Play time', colSpan: 2, rowSpan: 3 },
                { src: 'https://i.pinimg.com/736x/fd/3e/d3/fd3ed3a334508d1e9db7cdf36490ac8e.jpg', alt: 'First steps', colSpan: 3, rowSpan: 2 },
            ],
        },
        {
            id: 'solo',
            label: 'Solo',
            photos: [
                { src: 'https://i.pinimg.com/736x/c2/d4/69/c2d469f496e1e01579101c14159fc190.jpg', alt: 'Sweet smile', colSpan: 4, rowSpan: 3 },
                { src: 'https://i.pinimg.com/736x/69/36/fb/6936fb46d238367c39c6ff57c6b69e8a.jpg', alt: 'Little hands', colSpan: 2, rowSpan: 4 },
                { src: 'https://i.pinimg.com/1200x/c0/1d/51/c01d5194b8d2a0e987e6d38937a2e64b.jpg', alt: 'Peek-a-boo', colSpan: 2, rowSpan: 2 },
                { src: 'https://i.pinimg.com/736x/39/f6/7a/39f67a2ccf9d8191207825286e7e4f30.jpg', alt: 'Giggles', colSpan: 2, rowSpan: 2 },
                { src: 'https://i.pinimg.com/736x/b5/72/a0/b572a0cec03948e0896bc584b2ab7f22.jpg', alt: 'Bath day', colSpan: 2, rowSpan: 3 },
                { src: '/babies/baby.png', alt: 'Xyz', colSpan: 2, rowSpan: 2 },
            ],
        },
    ],
}
