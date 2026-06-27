import { useState } from 'react'
import { useOnboarding } from '../../../contexts/OnboardingContext'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ArrowRight, ArrowLeft, User, Briefcase, Building2, Calendar } from 'lucide-react'
import AnimatedSection from '@/components/marketing/AnimatedSection'

export default function PersonalizeStep() {
  const { userData, updateUserData, nextStep, previousStep } = useOnboarding()
  const [formData, setFormData] = useState(userData)

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUserData(formData)
    nextStep()
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 px-6 py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatedSection animation="fade-down">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
              Tell Us About <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">You</span>
            </h2>
            <p className="text-lg text-slate-600">
              This helps us customize your onboarding journey
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <Card className="border-2 border-slate-200 shadow-2xl">
            <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <User size={16} />
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Briefcase size={16} />
                  Your Role/Position
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Building2 size={16} />
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium"
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="People">People Team</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Calendar size={16} />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium"
                />
              </div>

              <div className="pt-6 flex gap-4">
                <Button
                  type="button"
                  size="lg"
                  onClick={previousStep}
                  className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-lg shadow-xl border-2 border-slate-200"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl"
                >
                  Continue
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </form>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}

