import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, Compass, CalendarCheck, ShieldCheck,
  Star, Heart, ArrowRight, ChevronRight, MapPin
} from 'lucide-react'
import destinations from '../data/destinations.json'

const features = [
  {
    icon: Compass,
    title: 'Discover',
    desc: 'Explore over 800 destinations across every island, province, and barangay in the Philippines.',
    color: 'bg-ocean/10 text-ocean',
    link: '/discover',
  },
  {
    icon: CalendarCheck,
    title: 'Book',
    desc: 'Reserve accommodations, tours, and vehicle rentals from trusted local partners.',
    color: 'bg-palm/10 text-palm',
    link: '/bookings',
  },
  {
    icon: ShieldCheck,
    title: 'Stay Safe',
    desc: 'On-demand roadside assistance, emergency SOS, and Bayanihan community support.',
    color: 'bg-sunset/10 text-sunset',
    link: '/roadside',
  },
]

const gradients = [
  'from-cyan-400 to-blue-600',
  'from-yellow-300 to-orange-400',
  'from-emerald-400 to-teal-600',
  'from-green-400 to-emerald-700',
  'from-amber-500 to-amber-800',
  'from-red-400 to-orange-600',
]

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState([])
  const navigate = useNavigate()
  const featured = destinations.slice(0, 6)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/discover?q=${encodeURIComponent(query)}`)
  }

  const toggleSave = (id) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Gradient background simulating a Philippine seascape */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean via-blue-700 to-palm opacity-95" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
              fill="#f9f7f3"
              fillOpacity="1"
            />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
            <MapPin size={14} />
            7,641 Islands. One App.
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover the Philippines.{' '}
            <span className="text-sand">Journey with confidence.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Your all-in-one travel companion for exploring, booking, and staying safe
            across every island, mountain, and hidden gem in the Philippines.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
              <Search size={20} className="ml-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, provinces, or activities..."
                className="flex-1 px-4 py-4 text-gray-700 bg-transparent outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="m-2 bg-ocean text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-200 text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {['Palawan', 'Siargao', 'Batanes', 'Boracay', 'Bohol'].map((place) => (
              <Link
                key={place}
                to={`/discover?q=${place}`}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                {place}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-heading mb-4">Everything for your Lakbay</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From planning your dream trip to getting help on the road — Lakbay has you covered.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc, color, link }) => (
            <Link
              key={title}
              to={link}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={26} />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-800 mb-3 group-hover:text-ocean transition-colors">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 text-ocean text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Learn more <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-heading">Featured Destinations</h2>
              <p className="text-gray-500 mt-2">Handpicked gems from across the archipelago</p>
            </div>
            <Link
              to="/discover"
              className="hidden md:flex items-center gap-2 text-ocean font-semibold hover:underline"
            >
              View all <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((dest, i) => (
              <div
                key={dest.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* Image placeholder */}
                <Link to={`/destination/${dest.id}`}>
                  <div className={`relative h-52 bg-gradient-to-br ${dest.gradient || gradients[i % gradients.length]}`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 left-3">
                      <span className={`pill text-white text-xs font-semibold ${
                        dest.badge === 'Hidden Gem' ? 'bg-coral' :
                        dest.badge === 'Popular' ? 'bg-ocean' :
                        'bg-palm'
                      }`}>
                        {dest.badge}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); toggleSave(dest.id) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    >
                      <Heart
                        size={16}
                        className={saved.includes(dest.id) ? 'text-coral fill-coral' : 'text-gray-400'}
                      />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-heading text-xl font-bold text-white">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-white/90 text-sm">
                        <MapPin size={12} />
                        {dest.province}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-sand fill-sand" />
                      <span className="font-semibold text-sm text-gray-800">{dest.rating}</span>
                      <span className="text-gray-400 text-xs">({dest.reviews.toLocaleString()})</span>
                    </div>
                    <Link
                      to={`/destination/${dest.id}`}
                      className="text-ocean text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      Explore <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dest.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="pill bg-gray-100 text-gray-600 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Link to="/discover" className="btn-primary flex items-center gap-2">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-ocean to-palm">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Lakbay?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Join thousands of Filipino travelers discovering the best of the Philippines
            with Lakbay as their trusted companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/discover"
              className="bg-white text-ocean px-8 py-4 rounded-xl font-bold text-lg hover:bg-sand hover:text-gray-900 transition-all duration-200 shadow-lg"
            >
              Start Your Lakbay →
            </Link>
            <Link
              to="/roadside"
              className="bg-sunset text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg"
            >
              🚨 Roadside SOS
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '12', label: 'Curated Destinations' },
              { num: '7,641', label: 'Philippine Islands' },
              { num: '50K+', label: 'Happy Travelers' },
              { num: '24/7', label: 'Roadside Support' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-heading text-3xl sm:text-4xl font-bold text-ocean mb-2">{num}</div>
                <div className="text-gray-500 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
