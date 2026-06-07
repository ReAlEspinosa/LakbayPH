import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="pt-16 min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-8">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-ocean to-palm flex items-center justify-center mx-auto shadow-2xl">
            <Compass size={64} className="text-white opacity-80 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="absolute -top-2 -right-2 w-14 h-14 rounded-full bg-sand flex items-center justify-center text-3xl shadow-lg">
            🗺️
          </div>
        </div>

        <h1 className="font-heading text-6xl font-bold text-ocean mb-3">404</h1>
        <h2 className="font-heading text-2xl font-bold text-gray-800 mb-4">
          Nawawala ka! (You're lost!)
        </h2>
        <p className="text-gray-500 leading-relaxed mb-8">
          This page doesn't exist on our map yet. The destination you're looking
          for may have moved, or the URL might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-ocean text-ocean font-semibold hover:bg-ocean hover:text-white transition-all duration-200"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 btn-primary"
          >
            <Home size={18} /> Back to Home
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm mb-4">Or explore these popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: '🏝️ Discover', path: '/discover' },
              { label: '📅 Planner', path: '/planner' },
              { label: '🏨 Bookings', path: '/bookings' },
              { label: '🚨 Roadside', path: '/roadside' },
            ].map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="pill bg-white border border-gray-200 text-gray-600 hover:border-ocean hover:text-ocean transition-all duration-200 shadow-sm"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
