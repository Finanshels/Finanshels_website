import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation'

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.5 })
  const count = useCountUp(end, duration, isVisible)

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

