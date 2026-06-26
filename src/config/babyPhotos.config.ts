import type { PhotoGalleryData } from '../types/planet.types'

/** Sample web URLs for now — swap any entry to `/babies/your-photo.jpg` when ready */
// const unsplash = (id: string, w = 800) =>
//     `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const BABY_PHOTO_GALLERY: PhotoGalleryData = {
    eyebrow: 'Our Stories',
    title: 'The Archive',
    subtitle: 'Captured moments from Xyz\'s first trip around the sun.',
    photos: [
        { src: 'https://i.pinimg.com/1200x/99/f6/a9/99f6a901d797e3ea57ef049cef096dc4.jpg', alt: 'Tiny toes', colSpan: 4, rowSpan: 3 },
        { src: 'https://i.pinimg.com/736x/c2/d4/69/c2d469f496e1e01579101c14159fc190.jpg', alt: 'Sweet smile', colSpan: 2, rowSpan: 4 },
        { src: 'https://i.pinimg.com/736x/69/36/fb/6936fb46d238367c39c6ff57c6b69e8a.jpg', alt: 'Little hands', colSpan: 2, rowSpan: 2 },
        { src: 'https://i.pinimg.com/1200x/c0/1d/51/c01d5194b8d2a0e987e6d38937a2e64b.jpg', alt: 'Peek-a-boo', colSpan: 2, rowSpan: 2 },
        { src: 'https://i.pinimg.com/1200x/b3/16/f0/b316f069f7b214e923f0960af5ea5db6.jpg', alt: 'Cozy nap', colSpan: 2, rowSpan: 3 },
        { src: 'https://i.pinimg.com/736x/39/f6/7a/39f67a2ccf9d8191207825286e7e4f30.jpg', alt: 'Giggles', colSpan: 2, rowSpan: 2 },
        { src: 'https://i.pinimg.com/736x/fd/3e/d3/fd3ed3a334508d1e9db7cdf36490ac8e.jpg', alt: 'First steps', colSpan: 3, rowSpan: 2 },
        { src: 'https://i.pinimg.com/736x/c9/e6/64/c9e664d0f811cf2995465e76ec594263.jpg', alt: 'Play time', colSpan: 2, rowSpan: 2 },
        { src: 'https://i.pinimg.com/736x/b5/72/a0/b572a0cec03948e0896bc584b2ab7f22.jpg', alt: 'Bath day', colSpan: 2, rowSpan: 2 },
        { src: 'https://i.pinimg.com/736x/e3/e5/ae/e3e5ae30935f8799161a808b293d4adf.jpg', alt: 'Family moment', colSpan: 2, rowSpan: 2 },
        { src: '/babies/baby.png', alt: 'Xyz', colSpan: 2, rowSpan: 2 },
        { src: 'https://i.pinimg.com/736x/ad/b4/ca/adb4ca5f4e4b74bfa095660f6fba9cf5.jpg', alt: 'Growing fast', colSpan: 3, rowSpan: 2 },
    ],
}
