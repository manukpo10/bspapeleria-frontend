import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Users, Clock } from 'lucide-react'

export default function BannerSlider({ slides, autoPlay = true, interval = 5000 }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => c === 0 ? slides.length - 1 : c - 1)
  const next = () => setCurrent(c => c === slides.length - 1 ? 0 : c + 1)

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [autoPlay, interval, slides.length])

  return (
    <div className="relative overflow-hidden rounded-3xl group">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full flex-shrink-0 relative">
            <img src={slide.imagen} alt={slide.titulo} className="w-full h-72 md:h-80 lg:h-88 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-dark/30 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
                <div className="max-w-lg">
                  {slide.tag && (
                    <span className="inline-block bg-primary/80 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                      {slide.tag}
                    </span>
                  )}
                  <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">
                    {slide.titulo}
                  </h3>
                  <p className="text-white/80 text-base mb-3">{slide.descripcion}</p>
                  
                  {slide.precio && (
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl font-heading font-black text-white">
                        ${slide.precio.toLocaleString('es-AR')}
                      </span>
                      {slide.precioOriginal && (
                        <span className="text-white/50 line-through text-lg">
                          ${slide.precioOriginal.toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>
                  )}

                  {(slide.likes || slide.inscriptos || slide.duracion) && (
                    <div className="flex flex-wrap gap-4 mb-4">
                      {slide.likes && (
                        <div className="flex items-center gap-1.5 text-white/80 text-sm">
                          <Heart size={14} className="text-pink-400" />
                          <span>{slide.likes}</span>
                        </div>
                      )}
                      {slide.inscriptos && (
                        <div className="flex items-center gap-1.5 text-white/80 text-sm">
                          <Users size={14} className="text-green-400" />
                          <span>{slide.inscriptos} inscriptos</span>
                        </div>
                      )}
                      {slide.duracion && (
                        <div className="flex items-center gap-1.5 text-white/80 text-sm">
                          <Clock size={14} className="text-yellow-400" />
                          <span>{slide.duracion}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {slide.cta && (
                    <a href={slide.link} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-secondary transition">
                      {slide.cta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
            <ChevronLeft className="text-dark" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
            <ChevronRight className="text-dark" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white w-6' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function BannerGrid({ titulo, subtitulo, banners }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {banners.map((banner, i) => (
        <a key={i} href={banner.link} className="group relative overflow-hidden rounded-2xl block">
          <img src={banner.imagen} alt={banner.titulo} className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition flex items-end p-4">
            <div>
              <h4 className="font-heading text-lg font-bold text-white">{banner.titulo}</h4>
              {banner.descripcion && (
                <p className="text-white/70 text-sm">{banner.descripcion}</p>
              )}
            </div>
          </div>
          {banner.proximamente && (
            <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
              Próximamente
            </div>
          )}
        </a>
      ))}
    </div>
  )
}

export function BannerSolo({ imagen, titulo, descripcion, tag, cta, link, reverse = false }) {
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      <div className={reverse ? 'lg:order-1' : 'lg:order-0'}>
        <img src={imagen} alt={titulo} className="w-full rounded-3xl shadow-xl" />
      </div>
      <div>
        {tag && (
          <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {tag}
          </span>
        )}
        <h3 className="font-heading text-3xl lg:text-4xl font-black text-dark mb-4">{titulo}</h3>
        <p className="text-dark/60 text-lg mb-6">{descripcion}</p>
        {cta && (
          <a href={link} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition">
            {cta}
          </a>
        )}
      </div>
    </div>
  )
}