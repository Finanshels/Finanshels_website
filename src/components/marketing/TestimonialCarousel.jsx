'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'

function clampRating(value) {
  const n = Math.round(Number(value))
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(5, n))
}

function getInitials(name) {
  if (typeof name !== 'string') return '?'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const letters = (words[0][0] ?? '') + (words.length > 1 ? words[words.length - 1][0] ?? '' : '')
  return letters.toUpperCase() || '?'
}

export default function TestimonialCarousel({ testimonials }) {
  const items = Array.isArray(testimonials) ? testimonials.filter(Boolean) : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (items.length === 0 ? 0 : (prevIndex + 1) % items.length))
  }, [items.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      items.length === 0 ? 0 : (prevIndex - 1 + items.length) % items.length
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || items.length < 2) return

    const interval = setInterval(() => {
      goToNext()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext, items.length])

  // Calculate visible testimonials for preview effect
  const getVisibleTestimonials = () => {
    const result = []
    const totalTestimonials = items.length

    // Show 3 cards: previous, current, next (on desktop)
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + totalTestimonials) % totalTestimonials
      result.push({
        testimonial: items[index],
        position: i,
        index: index,
      })
    }

    return result
  }

  if (items.length === 0) return null

  const visibleTestimonials = getVisibleTestimonials()

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Main Carousel Container */}
      <div
        className="relative h-[480px] md:h-[420px] flex items-center justify-center"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {visibleTestimonials.map(({ testimonial, position, index }) => (
          <div
            key={index}
            className={cn(
              'absolute transition-all duration-700 ease-in-out',
              position === 0 && 'z-30 scale-100 opacity-100 translate-x-0',
              position === -1 && 'z-10 scale-90 opacity-40 -translate-x-[calc(100%+2rem)] hidden md:block',
              position === 1 && 'z-10 scale-90 opacity-40 translate-x-[calc(100%+2rem)] hidden md:block'
            )}
            style={{
              width: 'min(600px, calc(100vw - 4rem))',
            }}
          >
            <div className="relative rounded-[32px] border-2 border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.15)] p-8 md:p-10 h-full">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-[#f16610]/10">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14H8c0-1.1.9-2 2-2h2V8h-2zm12 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-1.1.9-2 2-2h2V8h-2z" />
                </svg>
              </div>

              {/* Star Rating */}
              {clampRating(testimonial.rating) > 0 ? (
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(clampRating(testimonial.rating))].map((_, i) => (
                    <Star key={i} className="text-[#f16610] fill-[#f16610]" size={20} />
                  ))}
                </div>
              ) : null}

              {/* Quote */}
              <p className="text-slate-700 text-lg md:text-xl leading-relaxed mb-8 font-medium relative z-10">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-5 mt-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#f16610]/20 rounded-2xl blur-md" />
                  <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f16610] to-[#ff9248] text-xl font-bold text-white ring-2 ring-[#f16610]/20"
                    aria-hidden="true"
                  >
                    {getInitials(testimonial.name)}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                  <div className="text-sm text-slate-600 font-medium">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goToPrevious}
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-200 bg-white text-slate-600 hover:border-[#f16610] hover:text-[#f16610] hover:bg-[#fff9f5] transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'transition-all duration-300 rounded-full',
                index === currentIndex
                  ? 'w-8 h-2 bg-[#f16610]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-200 bg-white text-slate-600 hover:border-[#f16610] hover:text-[#f16610] hover:bg-[#fff9f5] transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Counter */}
      <div className="text-center mt-6">
        <p className="text-sm text-slate-500 font-medium">
          <span className="text-[#f16610] font-bold">{currentIndex + 1}</span> of {items.length}
        </p>
      </div>
    </div>
  )
}
