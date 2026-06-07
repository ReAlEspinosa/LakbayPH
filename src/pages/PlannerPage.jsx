import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, Plus, Trash2, GripVertical, MapPin, Star,
  Sparkles, X, Send, Calendar, Clock, ChevronDown, ChevronUp
} from 'lucide-react'
import destinations from '../data/destinations.json'

const defaultBucketList = destinations.slice(0, 6).map((d) => ({
  id: d.id,
  name: d.name,
  province: d.province,
  gradient: d.gradient,
  rating: d.rating,
}))

function AIModal({ onClose }) {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const sampleResponses = [
    "I'd suggest a 7-day Palawan adventure: Day 1-2 in El Nido (island hopping Tours A & B), Day 3 travel to Coron by speedboat, Day 4-5 in Coron (Kayangan Lake + wreck diving), Day 6 relax at Malcapuya Island, Day 7 fly home from Busuanga. Budget: ₱15,000-25,000 excluding flights.",
    "For a Visayas loop in 5 days: Day 1 arrive Cebu, whale sharks in Oslob + Kawasan Falls, Day 2 fly to Tagbilaran, Chocolate Hills + Tarsier Sanctuary, Day 3 Panglao beach day, Day 4 fast ferry to Cebu, Day 5 depart. Great for first-time Visayas visitors!",
    "Batanes in 4 days: Day 1 arrive Basco, Vayang Rolling Hills & Naidi Hills, Day 2 Sabtang Island day tour, Day 3 Batan Island loop by bike — White Beach, Mahatao, Valugan Boulder Beach, Day 4 depart. Book flights 3 months early — slots are limited!"
  ]

  const handleSend = () => {
    if (!prompt.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResponse(sampleResponses[Math.floor(Math.random() * sampleResponses.length)])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean to-palm flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Lakbay AI Trip Planner</h3>
              <p className="text-xs text-gray-400">Powered by Claude · Beta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 min-h-[200px]">
          {!response && !loading && (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✈️</div>
              <p className="text-gray-500 text-sm">
                Tell me your dream trip — where, when, and what kind of experience you're looking for.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['Beach hopping in Palawan', '5-day Cebu adventure', 'Family trip to Bohol', 'Solo Batanes escape'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="pill bg-ocean/10 text-ocean text-xs hover:bg-ocean hover:text-white transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-2 border-ocean border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Crafting your perfect lakbay...</p>
            </div>
          )}
          {response && (
            <div className="bg-ocean/5 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ocean to-palm flex items-center justify-center flex-shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{response}</p>
              </div>
              <button
                onClick={() => { setResponse(''); setPrompt('') }}
                className="mt-3 text-ocean text-xs font-medium hover:underline"
              >
                Ask another question →
              </button>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell me your trip idea..."
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none border border-gray-100 focus:border-ocean transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
              className="w-10 h-10 rounded-xl bg-ocean text-white flex items-center justify-center hover:bg-opacity-90 transition-all disabled:opacity-40 self-end"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlannerPage() {
  const [bucketList, setBucketList] = useState(defaultBucketList)
  const [days, setDays] = useState([
    { id: 1, date: new Date().toISOString().split('T')[0], stops: [] },
  ])
  const [showAI, setShowAI] = useState(false)
  const [expandedDay, setExpandedDay] = useState(1)

  const addDay = () => {
    const lastDate = days[days.length - 1]?.date || new Date().toISOString().split('T')[0]
    const next = new Date(lastDate)
    next.setDate(next.getDate() + 1)
    const newId = days.length + 1
    setDays([...days, {
      id: newId,
      date: next.toISOString().split('T')[0],
      stops: []
    }])
    setExpandedDay(newId)
  }

  const removeDay = (dayId) => setDays(days.filter((d) => d.id !== dayId))

  const addToDayFromBucket = (dayId, dest) => {
    setDays(days.map((d) =>
      d.id === dayId && !d.stops.find((s) => s.id === dest.id)
        ? { ...d, stops: [...d.stops, dest] }
        : d
    ))
  }

  const removeStop = (dayId, stopId) => {
    setDays(days.map((d) =>
      d.id === dayId ? { ...d, stops: d.stops.filter((s) => s.id !== stopId) } : d
    ))
  }

  const removeFromBucket = (id) => setBucketList(bucketList.filter((d) => d.id !== id))

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="pt-16 min-h-screen">
      {showAI && <AIModal onClose={() => setShowAI(false)} />}

      {/* Header */}
      <div className="bg-gradient-to-br from-palm to-ocean py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white mb-2">Trip Planner</h1>
            <p className="text-white/80">Build your dream Philippine itinerary.</p>
          </div>
          <button
            onClick={() => setShowAI(true)}
            className="flex items-center gap-2 bg-white text-ocean px-5 py-3 rounded-xl font-bold hover:bg-sand hover:text-gray-900 transition-all duration-200 shadow-lg"
          >
            <Sparkles size={18} />
            Lakbay AI
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Bucket List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Heart size={18} className="text-coral fill-coral" /> Bucket List
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">{bucketList.length} saved destinations</p>
                </div>
                <Link to="/discover" className="text-ocean text-sm font-medium hover:underline flex items-center gap-1">
                  <Plus size={14} /> Add more
                </Link>
              </div>
              <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {bucketList.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    <Heart size={32} className="mx-auto mb-3 text-gray-200" />
                    No saved destinations yet.
                    <Link to="/discover" className="block mt-2 text-ocean hover:underline">Browse destinations</Link>
                  </div>
                ) : (
                  bucketList.map((dest) => (
                    <div key={dest.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dest.gradient} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm truncate">{dest.name}</div>
                        <div className="text-gray-400 text-xs flex items-center gap-1">
                          <MapPin size={10} /> {dest.province}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="text-sand fill-sand" />
                          <span className="text-xs text-gray-600">{dest.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => addToDayFromBucket(expandedDay, dest)}
                          className="text-xs px-2 py-1 bg-ocean/10 text-ocean rounded-lg font-medium hover:bg-ocean hover:text-white transition-all duration-200"
                        >
                          + Day {expandedDay}
                        </button>
                        <button
                          onClick={() => removeFromBucket(dest.id)}
                          className="text-xs px-2 py-1 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-all duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Itinerary */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-ocean" /> My Itinerary
              </h2>
              <button
                onClick={addDay}
                className="flex items-center gap-2 text-sm bg-ocean text-white px-4 py-2 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-200"
              >
                <Plus size={15} /> Add Day
              </button>
            </div>

            {days.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-400 text-sm">No days added yet. Click "Add Day" to start building your itinerary.</p>
              </div>
            ) : (
              days.map((day) => (
                <div key={day.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-ocean text-white flex items-center justify-center font-bold text-sm">
                        D{day.id}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">Day {day.id}</div>
                        <div className="text-gray-400 text-xs flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(day.date)}
                          <span className="ml-2 text-ocean">{day.stops.length} stop{day.stops.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeDay(day.id) }}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                      {expandedDay === day.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </button>

                  {expandedDay === day.id && (
                    <div className="border-t border-gray-100 p-4 space-y-3">
                      {day.stops.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                          <GripVertical size={24} className="mx-auto mb-2 text-gray-200" />
                          Add destinations from your Bucket List →
                        </div>
                      ) : (
                        day.stops.map((stop, idx) => (
                          <div key={stop.id} className="flex items-center gap-3">
                            {idx > 0 && (
                              <div className="absolute -mt-6 ml-5 flex items-center gap-1 text-gray-400 text-xs">
                                <Clock size={10} /> ~2-4 hrs drive
                              </div>
                            )}
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stop.gradient} flex-shrink-0`} />
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 text-sm">{stop.name}</div>
                              <div className="text-gray-400 text-xs flex items-center gap-1">
                                <MapPin size={10} /> {stop.province}
                              </div>
                            </div>
                            <button
                              onClick={() => removeStop(day.id, stop.id)}
                              className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 transition-all duration-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {days.length > 0 && (
              <div className="bg-gradient-to-r from-ocean to-palm rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Trip Summary</div>
                    <div className="text-white/70 text-sm mt-1">
                      {days.length} day{days.length !== 1 ? 's' : ''} · {days.reduce((a, d) => a + d.stops.length, 0)} destination{days.reduce((a, d) => a + d.stops.length, 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <button className="bg-white text-ocean px-4 py-2 rounded-xl text-sm font-bold hover:bg-sand hover:text-gray-900 transition-all duration-200">
                    Save Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
