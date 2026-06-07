import React from 'react'
import { Link } from 'react-router-dom'
import { Anchor, Globe, Camera, MessageCircle, Play } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ocean flex items-center justify-center">
                <Anchor size={16} className="text-white" />
              </div>
              <span className="font-heading text-2xl font-bold text-white">Lakbay</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Discover the Philippines.<br />Journey with confidence.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-ocean flex items-center justify-center transition-colors duration-200">
                <Globe size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-ocean flex items-center justify-center transition-colors duration-200">
                <Camera size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-ocean flex items-center justify-center transition-colors duration-200">
                <MessageCircle size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-ocean flex items-center justify-center transition-colors duration-200">
                <Play size={15} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Destinations', path: '/discover' },
                { label: 'Trip Planner', path: '/planner' },
                { label: 'Accommodations', path: '/bookings' },
                { label: 'Community', path: '/community' },
                { label: 'Roadside Help', path: '/roadside' },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-sand transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Partners', 'List Your Property', 'Careers', 'Contact', 'Press'].map((item) => (
                <li key={item}>
                  <span
                    title="Coming soon"
                    className="text-gray-400 cursor-not-allowed select-none"
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get the App</h4>
            <p className="text-sm text-gray-400 mb-4">Plan your lakbay on the go.</p>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 transition-colors duration-200">
                <div className="text-white">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 transition-colors duration-200">
                <div className="text-white">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Lakbay. All rights reserved. Made with ❤️ for Filipino travelers.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
