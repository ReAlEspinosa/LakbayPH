import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star, Heart, CheckCircle, MapPin, Clock, Ticket, ArrowLeft,
  Plane, Bus, Ship, ChevronRight, User
} from 'lucide-react'
import destinations from '../data/destinations.json'

const modeIcon = { plane: Plane, bus: Bus, ferry: Ship }

export default function DestinationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dest = destinations.find((d) => d.id === id)

  const [activeTab, setActiveTab] = useState('Overview')
  const [saved, setSaved] = useState(false)
  const [visited, setVisited] = useState(false)

  if (!dest) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="font-heading text-2xl text-gray-700 mb-4">Destination not found</h2>
        <button onClick={() => navigate('/discover')} className="btn-primary">
          Back to Discover
        </button>
      </div>
    )
  }

  const nearby = dest.nearby
    ? dest.nearby.map((nid) => destinations.find((d) => d.id === nid)).filter(Boolean)
    : []

  const tabs = ['Overview', 'How to Get There', 'Reviews', 'Tips']

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className={`relative h-72 md:h-96 bg-gradient-to-br ${dest.gradient}`}>
        <div className="absolute inset-0 bg-black/30" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 md:left-8 z-10 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="absolute bottom-6 left-4 md:left-8 right-4 md:right-8 z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {dest.tags.map((tag) => (
              <span key={tag} className="pill bg-white/20 backdrop-blur-sm text-white text-xs border border-white/30">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-2">{dest.name}</h1>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin size={16} />
            <span className="font-medium">{dest.province}</span>
            <span className="text-white/50">·</span>
            <Star size={14} className="text-sand fill-sand" />
            <span className="font-semibold">{dest.rating}</span>
            <span className="text-white/70 text-sm">({dest.reviews.toLocaleString()} reviews)</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                saved ? 'bg-coral text-white' : 'bg-gray-100 text-gray-700 hover:bg-coral/10 hover:text-coral'
              }`}
            >
              <Heart size={16} className={saved ? 'fill-white' : ''} />
              {saved ? 'Saved' : 'Save to Bucket List'}
            </button>
            <button
              onClick={() => setVisited(!visited)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                visited ? 'bg-palm text-white' : 'bg-gray-100 text-gray-700 hover:bg-palm/10 hover:text-palm'
              }`}
            >
              <CheckCircle size={16} className={visited ? 'fill-white' : ''} />
              {visited ? 'Visited ✓' : 'Mark as Visited'}
            </button>
          </div>
          <Link
            to="/planner"
            className="hidden md:flex btn-primary items-center gap-2 text-sm"
          >
            Add to Itinerary <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-white text-ocean shadow-sm font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed text-base">{dest.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-ocean/5 rounded-xl p-4 flex flex-col gap-1">
                    <Clock size={18} className="text-ocean" />
                    <div className="text-xs text-gray-500 font-medium">Best Time to Visit</div>
                    <div className="text-sm font-semibold text-gray-800">{dest.bestTime}</div>
                  </div>
                  <div className="bg-palm/5 rounded-xl p-4 flex flex-col gap-1">
                    <Ticket size={18} className="text-palm" />
                    <div className="text-xs text-gray-500 font-medium">Entry Fee</div>
                    <div className="text-sm font-semibold text-gray-800">{dest.entryFee}</div>
                  </div>
                  <div className="bg-sand/20 rounded-xl p-4 flex flex-col gap-1">
                    <Star size={18} className="text-sand fill-sand" />
                    <div className="text-xs text-gray-500 font-medium">Rating</div>
                    <div className="text-sm font-semibold text-gray-800">{dest.rating} / 5.0</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'How to Get There' && (
              <div className="space-y-4">
                <p className="text-gray-500 text-sm mb-4">Step-by-step directions from Manila:</p>
                {dest.directions.map((dir, i) => {
                  const Icon = modeIcon[dir.mode] || Bus
                  return (
                    <div key={i} className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-ocean" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-ocean uppercase tracking-wide mb-1 capitalize">{dir.mode}</div>
                        <p className="text-gray-600 text-sm leading-relaxed">{dir.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="space-y-4">
                {dest.reviews_list?.map((rev, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean to-palm flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {rev.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-800 text-sm">{rev.name}</div>
                          <div className="text-gray-400 text-xs">{rev.date}</div>
                        </div>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              className={j < rev.rating ? 'text-sand fill-sand' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Tips' && (
              <div className="space-y-3">
                <p className="text-gray-500 text-sm mb-2">Local tips from experienced travelers:</p>
                {dest.tips?.map((tip, i) => (
                  <div key={i} className="flex gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-sand/30 flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Google Maps embed */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-ocean" />
                  Location Map
                </h3>
              </div>
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 relative overflow-hidden">
                <iframe
                  title={`Map of ${dest.name}`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${dest.lat},${dest.lng}&z=12&output=embed`}
                  className="w-full h-full"
                />
              </div>
              <div className="p-3">
                <a
                  href={`https://maps.google.com/?q=${dest.lat},${dest.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-ocean text-sm font-semibold hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Quick facts */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Facts</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Province</dt>
                  <dd className="font-medium text-gray-800">{dest.province}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Region</dt>
                  <dd className="font-medium text-gray-800">{dest.region}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Best Season</dt>
                  <dd className="font-medium text-gray-800 text-right max-w-[140px]">{dest.bestTime?.split(' (')[0]}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Reviews</dt>
                  <dd className="font-medium text-gray-800">{dest.reviews.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Nearby Destinations */}
        {nearby.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-6">Nearby Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {nearby.slice(0, 3).map((n) => (
                <Link
                  key={n.id}
                  to={`/destination/${n.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={`h-28 bg-gradient-to-br ${n.gradient}`} />
                  <div className="p-3">
                    <div className="font-semibold text-gray-800 text-sm group-hover:text-ocean transition-colors">{n.name}</div>
                    <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {n.province}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} className="text-sand fill-sand" />
                      <span className="text-xs font-medium text-gray-700">{n.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
