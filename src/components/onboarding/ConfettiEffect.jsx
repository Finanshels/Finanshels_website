'use client'

import { useEffect, useState } from 'react'

export default function ConfettiEffect({ show }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
      }))
      setParticles(newParticles)
      
      setTimeout(() => setParticles([]), 3000)
    }
  }, [show])

  if (!show || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute top-0 w-3 h-3 opacity-0 animate-confetti"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            backgroundColor: particle.color
          }}
        />
      ))}
    </div>
  )
}

