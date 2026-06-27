import { useState } from 'react'
import { Card } from './ui/Card'
import { cn } from '../lib/utils'

export default function FloatingCard({ children, className, ...props }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!isHovered) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 20
    const y = (e.clientY - rect.top - rect.height / 2) / 20
    
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000"
    >
      <Card
        className={cn(
          'transition-all duration-300 ease-out',
          isHovered && 'shadow-2xl',
          className
        )}
        style={{
          transform: `rotateX(${-position.y}deg) rotateY(${position.x}deg) translateZ(10px)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
        }}
        {...props}
      >
        {children}
      </Card>
    </div>
  )
}

