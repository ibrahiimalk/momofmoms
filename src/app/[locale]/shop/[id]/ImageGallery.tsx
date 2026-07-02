'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-3xl flex items-center justify-center text-6xl">👶</div>
    );
  }

  const prev = () => setActive(i => (i - 1 + images.length) % images.length);
  const next = () => setActive(i => (i + 1) % images.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100">
        <Image src={images[active]} alt={name} fill className="object-cover" priority />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow hover:bg-white transition-colors">
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow hover:bg-white transition-colors">
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                i === active ? 'border-pink-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
