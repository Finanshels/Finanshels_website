import { Card } from './ui/Card'
import AnimatedCounter from './AnimatedCounter'

export default function StatCard({ stat, description, icon: Icon, animated = false }) {
  const numericValue = animated ? parseInt(stat.replace(/[^0-9]/g, '')) : null
  const suffix = animated ? stat.replace(/[0-9]/g, '') : ''

  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-8 text-center">
        {Icon && (
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:scale-110 transition-transform">
              <Icon className="text-brand-primary" size={28} />
            </div>
          </div>
        )}
        <div className="text-4xl sm:text-5xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-2">
          {animated && numericValue ? (
            <AnimatedCounter end={numericValue} suffix={suffix} />
          ) : (
            stat
          )}
        </div>
        <div className="text-gray-600 text-sm sm:text-base">
          {description}
        </div>
      </div>
    </Card>
  )
}

