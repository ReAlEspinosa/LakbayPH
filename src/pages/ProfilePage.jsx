import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Heart, Star, Award, CheckCircle, Lock,
  Crown, Globe, ChevronRight, Settings, Bell, Shield
} from 'lucide-react'
import destinations from '../data/destinations.json'

const currentUser = {
  name: 'Maria Gabriela Santos',
  initials: 'MG',
  rank: 'Hari ng Lakbay',
  member_since: 'January 2023',
  destinations_visited: 12,
  bucket_list: 6,
  reviews_written: 9,
  badges_earned: 3,
  subscription: 'Explorer Pro',
}

const visitedIds = ['el-nido', 'boracay', 'siargao', 'chocolate-hills', 'cebu-oslob', 'vigan']
const visitDates = {
  'el-nido': 'March 2025',
  'boracay': 'January 2025',
  'siargao': 'October 2024',
  'chocolate-hills': 'August 2024',
  'cebu-oslob': 'July 2024',
  'vigan': 'December 2023',
}

const earnedBadges = [
  { name: 'Island Hopper', emoji: '🏝️', color: 'from-cyan-400 to-blue-500' },
  { name: 'Mountain Trekker', emoji: '🏔️', color: 'from-gray-500 to-gray-700' },
  { name: 'Hidden Gem Hunter', emoji: '💎', color: 'from-purple-400 to-indigo-600' },
]

const lockedBadges = [
  { name: 'Bayanihan Hero', emoji: '🤝', progress: 1, total: 3 },
  { name: 'Foodie Wanderer', emoji: '🍜', progress: 4, total: 8 },
  { name: 'Festival Goer', emoji: '🎉', progress: 1, total: 3 },
  { name: 'Coastal Explorer', emoji: '🐚', progress: 6, total: 10 },
  { name: 'Road Warrior', emoji: '🚗', progress: 280, total: 1000 },
]

const rankInfo = {
  'Hari ng Lakbay': { color: 'from-amber-400 to-yellow-600', pill: 'bg-amber-100 text-amber-700 border border-amber-200', emoji: '👑' },
  'Bayani ng Daan': { color: 'from-palm to-green-700', pill: 'bg-palm/10 text-palm border border-palm/20', emoji: '🌿' },
  Manlalakbay: { color: 'from-ocean to-blue-700', pill: 'bg-ocean/10 text-ocean border border-ocean/20', emoji: '🌊' },
  Lakbayer: { color: 'from-gray-400 to-gray-600', pill: 'bg-gray-100 text-gray-600 border border-gray-200', emoji: '🗺️' },
}

export default function ProfilePage() {
  const [language, setLanguage] = useState('English')
  const rank = rankInfo[currentUser.rank]
  const visitedDestinations = destinations.filter((d) => visitedIds.includes(d.id))

  return (
    <div className="pt-16 min-h-screen">
      {/* Profile Hero */}
      <div className={`bg-gradient-to-br ${rank.color} py-16 px-4`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white text-3xl font-bold">
              {currentUser.initials}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-md">
              {rank.emoji}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-heading text-3xl font-bold text-white">{currentUser.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className={`pill text-sm font-semibold ${rank.pill}`}>
                {rank.emoji} {currentUser.rank}
              </span>
              <span className="text-white/70 text-sm">Member since {currentUser.member_since}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Places Visited', value: currentUser.destinations_visited, icon: MapPin, color: 'text-ocean bg-ocean/10' },
            { label: 'Bucket List', value: currentUser.bucket_list, icon: Heart, color: 'text-coral bg-coral/10' },
            { label: 'Reviews Written', value: currentUser.reviews_written, icon: Star, color: 'text-sand bg-sand/20' },
            { label: 'Badges Earned', value: currentUser.badges_earned, icon: Award, color: 'text-purple-500 bg-purple-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center hover:shadow-md transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
                <Icon size={18} />
              </div>
              <div className="font-heading text-2xl font-bold text-gray-800">{value}</div>
              <div className="text-gray-400 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Award size={18} className="text-coral" /> My Badges
                </h2>
                <Link to="/community" className="text-ocean text-sm font-medium hover:underline flex items-center gap-1">
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {earnedBadges.map((badge) => (
                    <div key={badge.name} className={`bg-gradient-to-br ${badge.color} rounded-xl p-3 text-center shadow-md`}>
                      <div className="text-2xl mb-1">{badge.emoji}</div>
                      <div className="text-white text-xs font-semibold leading-tight">{badge.name}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">In Progress</p>
                  {lockedBadges.map((badge) => (
                    <div key={badge.name} className="flex items-center gap-3">
                      <div className="text-xl grayscale opacity-50">{badge.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 font-medium">{badge.name}</span>
                          <span className="text-xs text-gray-400">{badge.progress}/{badge.total}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-ocean to-palm rounded-full"
                            style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visited Places */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle size={18} className="text-palm" /> Visited Places
                </h2>
                <Link to="/discover" className="text-ocean text-sm font-medium hover:underline flex items-center gap-1">
                  Explore more <ChevronRight size={14} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {visitedDestinations.map((dest) => (
                  <Link
                    key={dest.id}
                    to={`/destination/${dest.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${dest.gradient} flex-shrink-0`}>
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-palm flex items-center justify-center">
                        <CheckCircle size={11} className="text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm group-hover:text-ocean transition-colors">{dest.name}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1">
                        <MapPin size={10} /> {dest.province}
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">{visitDates[dest.id]}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription */}
            <div className="bg-gradient-to-br from-ocean to-palm rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Crown size={18} className="text-sand" />
                <span className="font-semibold">{currentUser.subscription}</span>
              </div>
              <ul className="space-y-2 text-sm text-white/80 mb-5">
                {[
                  'Unlimited trip plans',
                  'Lakbay AI access',
                  'Priority roadside support',
                  'Exclusive partner discounts',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-sand flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200">
                Manage Subscription
              </button>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Settings size={16} className="text-gray-400" /> Settings
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {/* Language Toggle */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Language</span>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                    {['English', 'Filipino'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                          language === lang ? 'bg-white text-ocean shadow-sm' : 'text-gray-500'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { icon: Bell, label: 'Notifications' },
                  { icon: Shield, label: 'Privacy & Safety' },
                  { icon: Heart, label: 'Saved Preferences' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
