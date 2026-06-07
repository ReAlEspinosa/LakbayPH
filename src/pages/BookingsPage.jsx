import React, { useState, useMemo } from 'react'
import {
  Search, Star, Wifi, Coffee, Waves, Wind, UtensilsCrossed,
  Car, Bike, MapPin, Clock, Users, CheckCircle,
  Filter, Calendar, Truck, X, ChevronDown
} from 'lucide-react'
import accommodations from '../data/accommodations.json'

const amenityIcons = {
  WiFi: Wifi,
  Pool: Waves,
  Restaurant: UtensilsCrossed,
  AC: Wind,
  'Breakfast Included': Coffee,
  'Breakfast': Coffee,
  'Beach Access': Waves,
  Beachfront: Waves,
  'Private Beach': Waves,
  Spa: Star,
  'Surfboard Rental': Waves,
  'Common Kitchen': UtensilsCrossed,
  'Fan Rooms': Wind,
  'Heritage Tour': MapPin,
  'Tour Assistance': MapPin,
}

const tierColors = {
  Luxury: 'bg-amber-100 text-amber-700',
  'Mid-range': 'bg-ocean/10 text-ocean',
  Budget: 'bg-palm/10 text-palm',
}

const tours = [
  { id: 1, name: 'El Nido Island Hopping Tour A', location: 'El Nido, Palawan', price: 1200, duration: '8 hours', difficulty: 'Easy', gradient: 'from-cyan-400 to-blue-600', desc: 'Visit the Big Lagoon, Secret Lagoon, and Shimizu Island.' },
  { id: 2, name: 'Kawasan Falls Canyoneering', location: 'Badian, Cebu', price: 1800, duration: '6 hours', difficulty: 'Moderate', gradient: 'from-teal-400 to-blue-500', desc: 'Cliff jump, swim, and slide through the pristine Kawasan river system.' },
  { id: 3, name: 'Chocolate Hills ATV Adventure', location: 'Carmen, Bohol', price: 900, duration: '3 hours', difficulty: 'Easy', gradient: 'from-amber-400 to-green-500', desc: 'Ride ATVs through the iconic Bohol countryside and rice fields.' },
  { id: 4, name: 'Siargao Cloud 9 Surf Lessons', location: 'General Luna, Siargao', price: 1500, duration: '4 hours', difficulty: 'Beginner', gradient: 'from-emerald-400 to-teal-600', desc: 'Learn to surf at the legendary Cloud 9 break with certified instructors.' },
]

const vehicles = [
  { id: 1, type: 'Car', name: 'Toyota Vios / Honda City', seats: 5, price_day: 2500, partner: 'Avis Philippines', features: ['AC', 'GPS', 'Insurance'], gradient: 'from-blue-400 to-indigo-600' },
  { id: 2, type: 'Van', name: 'Toyota Hi-Ace Grandia', seats: 10, price_day: 4500, partner: 'JoyRide Rentals', features: ['AC', 'GPS', 'Driver Available', 'Insurance'], gradient: 'from-gray-500 to-gray-700' },
  { id: 3, type: 'Motorcycle', name: 'Honda Click 125i / Beat', seats: 2, price_day: 450, partner: 'Island Moto Rentals', features: ['Helmet Included', 'Manual/Automatic'], gradient: 'from-red-400 to-orange-500' },
]

const today = new Date().toISOString().split('T')[0]

// Booking modal — collects dates + guests before confirming
function BookingModal({ item, itemType, onClose, onConfirm }) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [errors, setErrors] = useState({})

  const nights = checkIn && checkOut
    ? Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0

  const total = itemType === 'accommodation'
    ? nights * (item.price_per_night || 0)
    : itemType === 'tour'
    ? guests * (item.price || 0)
    : item.price_day || 0

  const validate = () => {
    const e = {}
    if (!checkIn) e.checkIn = 'Please select a date'
    if (itemType === 'accommodation') {
      if (!checkOut) e.checkOut = 'Please select a check-out date'
      else if (checkOut <= checkIn) e.checkOut = 'Check-out must be after check-in'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleConfirm = () => {
    if (validate()) onConfirm()
  }

  const priceLabel = itemType === 'accommodation'
    ? `₱${(item.price_per_night || 0).toLocaleString()} × ${nights} night${nights !== 1 ? 's' : ''}`
    : itemType === 'tour'
    ? `₱${(item.price || 0).toLocaleString()} × ${guests} person${guests !== 1 ? 's' : ''}`
    : `₱${(item.price_day || 0).toLocaleString()} / day`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-800">Complete Your Booking</h3>
            <p className="text-gray-400 text-sm truncate max-w-xs">{item.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Date fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">
                {itemType === 'tour' ? 'Tour Date' : 'Check-in'}
              </label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => { setCheckIn(e.target.value); setErrors((prev) => ({ ...prev, checkIn: '' })) }}
                className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-colors ${errors.checkIn ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-ocean bg-gray-50'}`}
              />
              {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
            </div>
            {itemType === 'accommodation' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Check-out</label>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => { setCheckOut(e.target.value); setErrors((prev) => ({ ...prev, checkOut: '' })) }}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-colors ${errors.checkOut ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-ocean bg-gray-50'}`}
                />
                {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
              </div>
            )}
            {itemType !== 'accommodation' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  {itemType === 'tour' ? 'Guests' : 'Days'}
                </label>
                <div className="relative">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-ocean appearance-none"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Guests for accommodation */}
          {itemType === 'accommodation' && (
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Guests</label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-ocean appearance-none"
                >
                  {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} guest{n !== 1 ? 's' : ''}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Price summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{priceLabel}</span>
              <span className="font-semibold">₱{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Service fee</span>
              <span>₱{Math.round(total * 0.05).toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span className="text-ocean">₱{(total + Math.round(total * 0.05)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-ocean text-white font-bold hover:bg-opacity-90 transition-all duration-200 shadow-md"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmedModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-palm/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={36} className="text-palm" />
        </div>
        <h3 className="font-heading text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-500 text-sm mb-1">{item.name}</p>
        <p className="text-gray-400 text-xs mb-6">A confirmation has been sent to your email. Our partner will reach out with details.</p>
        <button
          onClick={onClose}
          className="w-full btn-primary"
        >
          Done
        </button>
      </div>
    </div>
  )
}

function AccommodationsTab() {
  const [location, setLocation] = useState('')
  const [tier, setTier] = useState('All')
  const [bookingItem, setBookingItem] = useState(null)
  const [confirmedItem, setConfirmedItem] = useState(null)

  const filtered = useMemo(() => accommodations.filter((a) => {
    const matchLoc = !location || a.location.toLowerCase().includes(location.toLowerCase())
    const matchTier = tier === 'All' || a.tier === tier
    return matchLoc && matchTier
  }), [location, tier])

  return (
    <div className="space-y-6">
      {bookingItem && (
        <BookingModal
          item={bookingItem}
          itemType="accommodation"
          onClose={() => setBookingItem(null)}
          onConfirm={() => { setConfirmedItem(bookingItem); setBookingItem(null) }}
        />
      )}
      {confirmedItem && (
        <ConfirmedModal item={confirmedItem} onClose={() => setConfirmedItem(null)} />
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative col-span-1 sm:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by location..."
              className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 outline-none border border-gray-100 focus:border-ocean transition-colors"
            />
          </div>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              min={today}
              className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 outline-none border border-gray-100 focus:border-ocean transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Filter size={15} className="text-gray-400 self-center" />
          {['All', 'Budget', 'Mid-range', 'Luxury'].map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`pill text-sm font-medium transition-all duration-200 ${
                tier === t ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600 hover:bg-ocean/10 hover:text-ocean'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏨</p>
            <p>No accommodations match your filters.</p>
          </div>
        ) : filtered.map((acc) => (
          <div key={acc.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`h-44 bg-gradient-to-br ${acc.image_gradient} relative`}>
              <div className="absolute top-3 left-3">
                <span className={`pill text-xs font-semibold ${tierColors[acc.tier]}`}>{acc.tier}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="text-white font-heading font-bold text-lg leading-tight">{acc.name}</div>
                <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                  <MapPin size={11} /> {acc.location}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-sand fill-sand" />
                  <span className="font-semibold text-sm">{acc.rating}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-ocean text-lg">₱{acc.price_per_night.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs">/night</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {acc.amenities.slice(0, 4).map((am) => {
                  const Icon = amenityIcons[am] || Wifi
                  return (
                    <span key={am} className="flex items-center gap-1 pill bg-gray-100 text-gray-600 text-xs">
                      <Icon size={10} /> {am}
                    </span>
                  )
                })}
              </div>
              <button
                onClick={() => setBookingItem(acc)}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-ocean text-white hover:bg-opacity-90 transition-all duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ToursTab() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [bookingItem, setBookingItem] = useState(null)
  const [confirmedItem, setConfirmedItem] = useState(null)

  const filtered = useMemo(() => tours.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase())
    const matchDiff = difficulty === 'All' || t.difficulty === difficulty
    return matchSearch && matchDiff
  }), [search, difficulty])

  const diffColor = {
    Easy: 'bg-palm/10 text-palm',
    Moderate: 'bg-sand/30 text-amber-700',
    Beginner: 'bg-ocean/10 text-ocean',
  }

  return (
    <div className="space-y-6">
      {bookingItem && (
        <BookingModal
          item={bookingItem}
          itemType="tour"
          onClose={() => setBookingItem(null)}
          onConfirm={() => { setConfirmedItem(bookingItem); setBookingItem(null) }}
        />
      )}
      {confirmedItem && (
        <ConfirmedModal item={confirmedItem} onClose={() => setConfirmedItem(null)} />
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tours by name or location..."
              className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 outline-none border border-gray-100 focus:border-ocean transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Filter size={15} className="text-gray-400 self-center" />
          {['All', 'Easy', 'Moderate', 'Beginner'].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`pill text-sm font-medium transition-all duration-200 ${
                difficulty === d ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600 hover:bg-ocean/10 hover:text-ocean'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏄</p>
            <p>No tours match your search.</p>
          </div>
        ) : filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className={`h-36 bg-gradient-to-br ${t.gradient} relative`}>
              <div className="absolute top-3 left-3">
                <span className={`pill text-xs font-semibold ${diffColor[t.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                  {t.difficulty}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{t.name}</h3>
              <div className="flex items-center gap-3 text-gray-400 text-xs mb-2">
                <span className="flex items-center gap-1"><MapPin size={10} /> {t.location}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {t.duration}</span>
              </div>
              <p className="text-gray-500 text-xs mb-4 leading-relaxed">{t.desc}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-ocean text-lg">₱{t.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs">/person</span>
                </div>
                <button
                  onClick={() => setBookingItem(t)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-ocean text-white hover:bg-opacity-90 transition-all duration-200"
                >
                  Book Tour
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RentalsTab() {
  const [typeFilter, setTypeFilter] = useState('All')
  const [bookingItem, setBookingItem] = useState(null)
  const [confirmedItem, setConfirmedItem] = useState(null)

  const filtered = useMemo(() =>
    typeFilter === 'All' ? vehicles : vehicles.filter((v) => v.type === typeFilter),
    [typeFilter]
  )

  const typeIcon = { Car, Van: Truck, Motorcycle: Bike }

  return (
    <div className="space-y-6">
      {bookingItem && (
        <BookingModal
          item={{ ...bookingItem, name: bookingItem.name, price_day: bookingItem.price_day }}
          itemType="rental"
          onClose={() => setBookingItem(null)}
          onConfirm={() => { setConfirmedItem(bookingItem); setBookingItem(null) }}
        />
      )}
      {confirmedItem && (
        <ConfirmedModal item={confirmedItem} onClose={() => setConfirmedItem(null)} />
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Filter size={15} className="text-gray-400 self-center" />
          {['All', 'Car', 'Van', 'Motorcycle'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`pill text-sm font-medium transition-all duration-200 ${
                typeFilter === t ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600 hover:bg-ocean/10 hover:text-ocean'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((v) => {
          const Icon = typeIcon[v.type] || Car
          return (
            <div key={v.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className={`h-32 bg-gradient-to-br ${v.gradient} flex items-center justify-center`}>
                <Icon size={48} className="text-white/70" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="pill bg-gray-100 text-gray-600 text-xs font-semibold">{v.type}</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Users size={11} /> {v.seats} seats
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mt-2 mb-1">{v.name}</h3>
                <div className="text-gray-400 text-xs mb-3">via {v.partner}</div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {v.features.map((f) => (
                    <span key={f} className="pill bg-ocean/10 text-ocean text-xs">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-ocean text-lg">₱{v.price_day.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs">/day</span>
                  </div>
                  <button
                    onClick={() => setBookingItem(v)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-ocean text-white hover:bg-opacity-90 transition-all duration-200"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('Accommodations')
  const tabs = ['Accommodations', 'Tours & Activities', 'Vehicle Rentals']

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-to-br from-ocean to-teal-700 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Book Your Stay & Adventures</h1>
          <p className="text-white/80 text-lg">Accommodations, tours, and vehicle rentals from trusted local partners.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 max-w-lg">
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

        {activeTab === 'Accommodations' && <AccommodationsTab />}
        {activeTab === 'Tours & Activities' && <ToursTab />}
        {activeTab === 'Vehicle Rentals' && <RentalsTab />}
      </div>
    </div>
  )
}
