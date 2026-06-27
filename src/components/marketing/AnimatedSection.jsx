'use client'

import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { cn } from '../lib/utils'

export default function AnimatedSection({ 
  children, 
  className,
  animation = 'fade-up',
  delay = 0,
  ...props 
}) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.1 })

  const animations = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-down': '-translate-y-8 opacity-0',
    'fade-left': 'translate-x-8 opacity-0',
    'fade-right': '-translate-x-8 opacity-0',
    'fade': 'opacity-0',
    'scale': 'scale-95 opacity-0',
    'zoom': 'scale-110 opacity-0'
  }

  const initialState = animations[animation] || animations['fade-up']

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : initialState,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
}

