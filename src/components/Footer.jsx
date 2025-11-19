import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Mail, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-20 px-6 sm:px-8 lg:px-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <img 
                src="/finanshels_logo.png" 
                alt="Finanshels" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md font-medium mb-8">
              Empowering startups across MENA with world-class financial operations, 
              accounting, and tax services. Founded in 2022, trusted by 5000+ SMBs.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com/company/finanshels"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="https://twitter.com/finanshels"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Twitter size={22} />
              </a>
              <a
                href="https://www.instagram.com/finanshels"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://www.youtube.com/@finanshelshq"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Youtube size={22} />
              </a>
              <a
                href="mailto:talents@finanshels.com"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Company</h3>
            <ul className="space-y-3 text-slate-300 font-medium text-base">
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/customers" className="hover:text-white transition-colors">Customers</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xl mb-6 text-white">Get in Touch</h3>
            <ul className="space-y-4 text-slate-300 font-medium text-base">
              <li>
                <a href="mailto:hello@finanshels.com" className="hover:text-white transition-colors">
                  hello@finanshels.com
                </a>
              </li>
              <li>+971 50 717 8156</li>
              <li>Dubai Internet City, in5 Tech</li>
              <li>Kerala • Ahmedabad (upcoming)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-10 text-center text-slate-400 text-base font-medium">
          <p>© 2025 Finanshels. All rights reserved. Backed by MBRIF, in5 Tech, Kube VC.</p>
        </div>
      </div>
    </footer>
  )
}
