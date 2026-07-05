'use client'

interface ImageData {
  src: string
  alt: string
  caption: string
  sourceUrl: string
}

const PLACEHOLDER_IMAGES: ImageData[] = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/320px-Flag_of_the_United_Nations.svg.png',
    alt: 'United Nations Flag',
    caption: 'United Nations Flag · Wikimedia Commons · Public Domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Flag_of_the_United_Nations.svg',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/UN_General_Assembly_hall.jpg/320px-UN_General_Assembly_hall.jpg',
    alt: 'UN General Assembly Hall',
    caption: 'UN General Assembly Hall · Wikimedia Commons · CC BY-SA 3.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:UN_General_Assembly_hall.jpg',
  },
]

interface ImagesSectionProps {
  country?: string
}

export function ImagesSection({ country }: ImagesSectionProps) {
  const images = PLACEHOLDER_IMAGES

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-accent">Images</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {images.map((img, i) => (
          <a
            key={i}
            href={img.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white"
          >
            <div className="aspect-video overflow-hidden bg-gray-50">
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted">{img.caption}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
