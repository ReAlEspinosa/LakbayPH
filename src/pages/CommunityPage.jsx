import React, { useState } from 'react'
import { Trophy, MapPin, Star, Award, X, Send, Clock, Lock } from 'lucide-react'
import users from '../data/users.json'

const rankColors = {
  'Hari ng Lakbay': 'bg-amber-100 text-amber-700 border border-amber-200',
  'Bayani ng Daan': 'bg-palm/10 text-palm border border-palm/20',
  Manlalakbay: 'bg-ocean/10 text-ocean border border-ocean/20',
  Lakbayer: 'bg-gray-100 text-gray-600 border border-gray-200',
}

const rankEmoji = {
  'Hari ng Lakbay': '👑',
  'Bayani ng Daan': '🌿',
  Manlalakbay: '🌊',
  Lakbayer: '🗺️',
}

const allBadges = [
  { name: 'Island Hopper', emoji: '🏝️', desc: 'Visited 5+ island destinations', color: 'from-cyan-400 to-blue-500', earned: true },
  { name: 'Mountain Trekker', emoji: '🏔️', desc: 'Summited 3+ mountain peaks', color: 'from-gray-500 to-gray-700', earned: true },
  { name: 'Hidden Gem Hunter', emoji: '💎', desc: 'Discovered 5+ hidden gem spots', color: 'from-purple-400 to-indigo-600', earned: true },
  { name: 'Bayanihan Hero', emoji: '🤝', desc: 'Helped 3+ stranded motorists', color: 'from-palm to-green-700', earned: false },
  { name: 'Foodie Wanderer', emoji: '🍜', desc: 'Tried cuisine in 8+ provinces', color: 'from-orange-400 to-red-500', earned: false },
  { name: 'Festival Goer', emoji: '🎉', desc: 'Attended 3+ Filipino festivals', color: 'from-pink-400 to-coral', earned: false },
  { name: 'Coastal Explorer', emoji: '🐚', desc: 'Visited 10+ coastal destinations', color: 'from-teal-400 to-cyan-600', earned: false },
  { name: 'Road Warrior', emoji: '🚗', desc: 'Drove 1,000+ km across Philippines', color: 'from-sunset to-red-600', earned: false },
]

const activityFeed = [
  { user: 'Maria Gabriela', action: 'visited', dest: 'El Nido, Palawan', time: '2 hours ago', initials: 'MG' },
  { user: 'Carlos Reyes', action: 'saved', dest: 'Batanes Islands to Bucket List', time: '5 hours ago', initials: 'CR' },
  { user: 'Ana Villanueva', action: 'reviewed', dest: 'Siargao Island', time: '1 day ago', initials: 'AV' },
  { user: 'Juan Mendoza', action: 'visited', dest: 'Vigan Heritage City', time: '2 days ago', initials: 'JP' },
  { user: 'Theresa Lim', action: 'saved', dest: 'Chocolate Hills to Bucket List', time: '3 days ago', initials: 'TL' },
  { user: 'Maria Gabriela', action: 'earned badge', dest: 'Hidden Gem Hunter 💎', time: '4 days ago', initials: 'MG' },
]

function TipModal({ onClose }) {
  const [tip, setTip] = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!location.trim()) e.location = 'Please enter a destination'
    if (!tip.trim()) e.tip = 'Please write your tip before submitting'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setSubmitted(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-heading text-lg font-bold text-gray-800">Share a Tip</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>
        {submitted ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-semibold text-gray-800">Tip shared! Salamat!</p>
            <p className="text-gray-400 text-sm mt-1">Your tip helps fellow travelers.</p>
          </div>
        ) : (
          <>
            <div className="p-5 space-y-4">
              <div>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setErrors((prev) => ({ ...prev, location: '' })) }}
                    placeholder="Which destination? (required)"
                    className={`w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 outline-none border transition-colors ${errors.location ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-ocean'}`}
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs mt-1 ml-1">{errors.location}</p>}
              </div>
              <div>
                <textarea
                  value={tip}
                  onChange={(e) => { setTip(e.target.value); setErrors((prev) => ({ ...prev, tip: '' })) }}
                  placeholder="Share your travel tip, local hack, or experience... (required)"
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 outline-none border transition-colors resize-none ${errors.tip ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-ocean'}`}
                />
                {errors.tip && <p className="text-red-500 text-xs mt-1 ml-1">{errors.tip}</p>}
              </div>
            </div>
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Send size={16} /> Share Tip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const [showTipModal, setShowTipModal] = useState(false)

  return (
    <div className="pt-16 min-h-screen">
      {showTipModal && <TipModal onClose={() => setShowTipModal(false)} />}

      {/* Header */}
      <div className="bg-gradient-to-br from-coral to-purple-700 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Lakbay Community</h1>
          <p className="text-white/80 text-lg mb-6">
            Connect with fellow Filipino travelers, earn badges, and share your adventures.
          </p>
          <button
            onClick={() => setShowTipModal(true)}
            className="bg-white text-coral px-6 py-3 rounded-xl font-bold hover:bg-sand hover:text-gray-900 transition-all duration-200 shadow-lg"
          >
            💬 Share a Tip
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left col */}
          <div className="lg:col-span-1 space-y-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <Trophy size={18} className="text-sand fill-sand" />
                <h2 className="font-heading text-lg font-bold text-gray-800">Explorer Leaderboard</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {users.map((user, i) => (
                  <div key={user.id} className={`p-4 flex items-center gap-3 ${i === 0 ? 'bg-amber-50' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-400 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean to-palm flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm truncate">{user.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`pill text-xs ${rankColors[user.rank]}`}>
                          {rankEmoji[user.rank]} {user.rank}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-ocean text-sm">{user.destinations_visited}</div>
                      <div className="text-gray-400 text-xs">places</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-heading text-lg font-bold text-gray-800">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {activityFeed.map((item, i) => (
                  <div key={i} className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean to-palm flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {item.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <span className="font-semibold">{item.user}</span>{' '}
                        {item.action}{' '}
                        <span className="text-ocean font-medium">{item.dest}</span>
                      </p>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                        <Clock size={10} /> {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col: Badges */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-coral" />
                  <h2 className="font-heading text-lg font-bold text-gray-800">Achievement Badges</h2>
                </div>
                <span className="text-gray-400 text-sm">3 of 8 earned</span>
              </div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-200 ${
                      badge.earned
                        ? 'bg-gradient-to-br ' + badge.color + ' shadow-md hover:shadow-lg hover:-translate-y-0.5'
                        : 'bg-gray-50 border border-dashed border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`text-3xl mb-2 ${!badge.earned ? 'grayscale' : ''}`}>
                      {badge.earned ? badge.emoji : <Lock size={28} className="text-gray-400" />}
                    </div>
                    <div className={`font-semibold text-sm mb-1 leading-tight ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                      {badge.name}
                    </div>
                    <div className={`text-xs leading-relaxed ${badge.earned ? 'text-white/80' : 'text-gray-400'}`}>
                      {badge.desc}
                    </div>
                    {badge.earned && (
                      <div className="mt-2 pill bg-white/30 text-white text-xs font-semibold">Earned ✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Members', value: '52,000+', emoji: '👥' },
                { label: 'Tips Shared', value: '18,400+', emoji: '💬' },
                { label: 'Places Reviewed', value: '94,000+', emoji: '⭐' },
                { label: 'Badges Awarded', value: '210,000+', emoji: '🏅' },
              ].map(({ label, value, emoji }) => (
                <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="font-bold text-gray-800 text-lg">{value}</div>
                  <div className="text-gray-400 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
