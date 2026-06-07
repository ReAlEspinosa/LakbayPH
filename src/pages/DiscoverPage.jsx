import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Star, Heart, MapPin, Filter } from 'lucide-react'
import destinations from '../data/destinations.json'

const filters = ['All', 'Beaches', 'Mountains', 'Waterfalls', 'Heritage', 'Festivals', 'Hidden Gems']

const tagMap = {
  Beaches: ['Beach', 'Island Hopping', 'Snorkeling', 'Coastal Explorer'],
  Mountains: ['Mountains', 'Trekking', 'Mountaineering', 'Summit', 'Rolling Hills'],
  Waterfalls: ['Waterfalls', 'Canyoneering'],
  Heritage: ['Heritage', 'Colonial', 'Culture', 'UNESCO', 'Indigenous'],
  Festivals: ['Festival', 'Cultural'],
  'Hidden Gems': ['Hidden Gem'],
}

const badgeStyles = {
  'Hidden Gem': 'bg-coral text-white',
  Popular: 'bg-ocean text-white',
  Trending: 'bg-palm text-white',
  Iconic: 'bg-sunset text-white',
  'Off the beaten path': 'bg-gray-700 text-white',
}

export default function DiscoverPage() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQ)
  const [activeFilter, setActiveFilter] = useState('All')
  const [saved, setSaved] = useState([])

  const toggleSave = (id) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const filtered = useMemo(() => {
    let list = destinations
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (activeFilter !== 'All') {
      if (activeFilter === 'Hidden Gems') {
        list = list.filter((d) => d.badge === 'Hidden Gem')
      } else {
        const matchTags = tagMap[activeFilter] || []
        list = list.filter((d) => d.tags.some((t) => matchTags.some((m) => t.includes(m))))
      }
    }
    return list
  }, [query, activeFilter])

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-ocean to-palm py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Discover the Philippines
          </h1>
          <p className="text-white/80 text-lg mb-8">
            From pristine beaches to misty mountains — find your next adventure.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, provinces, or activities..."
              className="w-full pl-11 pr-4 py-4 rounded-xl bg-white text-gray-700 shadow-lg outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Filter size={18} className="text-gray-400 self-center mr-1" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`pill font-medium transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-ocean text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-ocean/10 hover:text-ocean border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-6">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> destination{filtered.length !== 1 ? 's' : ''}
          {query && <span> for "<span className="text-ocean">{query}</span>"</span>}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="font-heading text-xl text-gray-700 mb-2">No destinations found</h3>
            <p className="text-gray-500 text-sm">Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <Link to={`/destination/${dest.id}`}>
                  <div className={`relative h-48 bg-gradient-to-br ${dest.gradient}`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 left-3">
                      <span className={`pill text-xs font-semibold ${badgeStyles[dest.badge] || 'bg-gray-600 text-white'}`}>
                        {dest.badge}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); toggleSave(dest.id) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-sm"
                    >
                      <Heart
                        size={15}
                        className={saved.includes(dest.id) ? 'text-coral fill-coral' : 'text-gray-400'}
                      />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <h3 className="font-heading text-lg font-bold text-white leading-tight">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                        <MapPin size={11} />
                        {dest.province}
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star size={13} className="text-sand fill-sand" />
                    <span className="font-semibold text-sm">{dest.rating}</span>
                    <span className="text-gray-400 text-xs">({dest.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dest.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="pill bg-ocean/10 text-ocean text-xs">{tag}</span>
                    ))}
                  </div>
                  <Link
                    to={`/destination/${dest.id}`}
                    className="block w-full text-center py-2 rounded-lg bg-ocean/10 text-ocean text-sm font-semibold hover:bg-ocean hover:text-white transition-all duration-200"
                  >
                    View Destination
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
