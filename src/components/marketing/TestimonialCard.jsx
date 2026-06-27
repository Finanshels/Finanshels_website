import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card } from './ui/Card'

export default function TestimonialCard({ testimonial }) {
  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-indigo-200 hover:-translate-y-1 group">
      <div className="p-10 flex flex-col h-full relative">
        <div className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-200 transition-colors">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14H8c0-1.1.9-2 2-2h2V8h-2zm12 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-1.1.9-2 2-2h2V8h-2z" />
          </svg>
        </div>
        
        <div className="flex items-center gap-1 mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="text-yellow-500 fill-yellow-500" size={18} />
          ))}
        </div>
        
        <p className="text-slate-700 text-lg leading-relaxed mb-8 flex-1 font-medium">
          "{testimonial.quote}"
        </p>
        
        <div className="flex items-center gap-5">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-2xl ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all object-cover"
          />
          <div>
            <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
            <div className="text-sm text-slate-600 font-medium">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

