import React, { useState } from 'react'
import {
  AlertTriangle, Wrench, Battery, Truck, Fuel, Thermometer, Key,
  Phone, Navigation, Star, Users, CheckCircle, X
} from 'lucide-react'
import providers from '../data/providers.json'

const services = [
  { id: 'flat-tire', label: 'Flat Tire', icon: Wrench, color: 'text-orange-500 bg-orange-50' },
  { id: 'dead-battery', label: 'Dead Battery', icon: Battery, color: 'text-yellow-500 bg-yellow-50' },
  { id: 'towing', label: 'Towing', icon: Truck, color: 'text-blue-500 bg-blue-50' },
  { id: 'fuel', label: 'Fuel', icon: Fuel, color: 'text-green-500 bg-green-50' },
  { id: 'overheating', label: 'Overheating', icon: Thermometer, color: 'text-red-500 bg-red-50' },
  { id: 'lockout', label: 'Lockout', icon: Key, color: 'text-purple-500 bg-purple-50' },
]

const emergencyNumbers = [
  { label: 'MMDA', number: '136', desc: 'Metro Manila traffic emergency' },
  { label: 'PNP', number: '911', desc: 'Philippine National Police' },
  { label: 'NDRRMC', number: '8870-0000', desc: 'Disaster risk & emergency' },
  { label: 'AAP Roadside', number: '8888', desc: 'Auto Association Philippines' },
  { label: 'Lakbay Hotline', number: '1800-LAKBAY', desc: 'Our 24/7 travel support line' },
]

// SOS state machine: idle → confirming → sent
function SOSSection() {
  const [sosState, setSosState] = useState('idle')

  const handleConfirm = () => {
    setSosState('sent')
    setTimeout(() => setSosState('idle'), 5000)
  }

  if (sosState === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-36 h-36 rounded-full bg-palm flex items-center justify-center shadow-2xl">
          <CheckCircle size={64} className="text-white" />
        </div>
        <div className="text-center">
          <p className="font-heading text-xl font-bold text-palm">SOS Sent!</p>
          <p className="text-gray-500 text-sm mt-1">
            Emergency contacts and nearest providers have been notified with your location.
          </p>
          <button
            onClick={() => setSosState('idle')}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  if (sosState === 'confirming') {
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border-2 border-sunset shadow-2xl overflow-hidden">
        <div className="bg-sunset px-6 py-4 flex items-center gap-3">
          <AlertTriangle size={24} className="text-white flex-shrink-0" />
          <h3 className="font-heading text-lg font-bold text-white">Confirm Emergency SOS</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-700 text-sm leading-relaxed mb-1">
            This will <strong>immediately alert emergency contacts</strong> and share
            your GPS location with nearby roadside providers.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Only use this in a genuine emergency. False SOS alerts may result in account suspension.
          </p>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={() => setSosState('idle')}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <X size={16} /> Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-sunset text-white font-bold hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <AlertTriangle size={16} /> Yes, Send SOS
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setSosState('confirming')}
        className="w-36 h-36 rounded-full bg-sunset flex flex-col items-center justify-center shadow-2xl animate-pulse_glow hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-sunset/50"
      >
        <AlertTriangle size={40} className="text-white mb-1" />
        <span className="text-white font-bold text-lg leading-tight">EMERGENCY</span>
        <span className="text-white/80 text-xs">SOS</span>
      </button>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Press to alert emergency contacts and share your GPS location.
        <span className="block text-xs text-gray-400 mt-1">A confirmation step will appear.</span>
      </p>
    </div>
  )
}

export default function RoadsidePage() {
  const [selectedService, setSelectedService] = useState(null)
  const [bayanihan, setBayanihan] = useState(false)
  const [helpRequested, setHelpRequested] = useState(null)

  return (
    <div className="pt-16 min-h-screen bg-bg">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sunset to-red-700 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-5">
            <AlertTriangle size={14} />
            24/7 On-Demand Roadside Assistance
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Stranded? We've Got You.
          </h1>
          <p className="text-white/80 text-lg">
            Get fast roadside help anywhere in the Philippines — from certified providers and the Bayanihan community.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* SOS */}
        <div className="flex flex-col items-center">
          <SOSSection />
        </div>

        {/* Service Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-heading text-xl font-bold text-gray-800 mb-2">What do you need help with?</h2>
          <p className="text-gray-500 text-sm mb-6">Select your service type to find nearby assistance.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {services.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setSelectedService(selectedService === id ? null : id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedService === id
                    ? 'border-sunset bg-sunset/5'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-sm font-semibold ${selectedService === id ? 'text-sunset' : 'text-gray-700'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
          <button className="mt-5 w-full py-3 bg-sunset text-white rounded-xl font-bold hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md">
            <Navigation size={18} />
            Find Nearby Help
          </button>
        </div>

        {/* Provider List */}
        <div>
          <h2 className="font-heading text-xl font-bold text-gray-800 mb-4">Available Providers Near You</h2>
          <div className="space-y-4">
            {providers.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sunset/10 flex items-center justify-center text-sunset font-bold flex-shrink-0">
                    {p.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{p.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="pill bg-sunset/10 text-sunset text-xs">{p.service}</span>
                          <span className="flex items-center gap-1"><Navigation size={12} /> {p.distance}</span>
                          <span className="flex items-center gap-1 text-palm font-medium">ETA: {p.eta}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star size={13} className="text-sand fill-sand" />
                        <span className="font-semibold text-sm">{p.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <a
                        href={`tel:${p.phone}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-palm/10 text-palm rounded-lg text-sm font-semibold hover:bg-palm hover:text-white transition-all duration-200"
                      >
                        <Phone size={14} /> Call Now
                      </a>
                      <button
                        onClick={() => setHelpRequested(helpRequested === p.id ? null : p.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          helpRequested === p.id
                            ? 'bg-palm text-white'
                            : 'bg-sunset text-white hover:bg-opacity-90'
                        }`}
                      >
                        {helpRequested === p.id ? (
                          <><CheckCircle size={14} /> Requested</>
                        ) : (
                          <><Wrench size={14} /> Request Help</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bayanihan Mode */}
        <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
          bayanihan ? 'border-palm bg-palm/5' : 'border-gray-100 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bayanihan ? 'bg-palm text-white' : 'bg-gray-100 text-gray-500'}`}>
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bayanihan Mode</h3>
                <p className="text-sm text-gray-500">Ask nearby motorists for help</p>
              </div>
            </div>
            <button
              onClick={() => setBayanihan(!bayanihan)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${bayanihan ? 'bg-palm' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${bayanihan ? 'translate-x-7' : 'translate-x-0'}`}
              />
            </button>
          </div>
          {bayanihan && (
            <div className="mt-4 bg-palm/10 rounded-xl p-4 text-sm text-palm font-medium">
              ✓ Bayanihan Mode is active. Nearby Lakbay users within 5km will see your request.
              <div className="mt-2 text-palm/70 font-normal">3 motorists are currently near your location.</div>
            </div>
          )}
        </div>

        {/* Emergency Numbers */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <h2 className="font-heading text-xl font-bold mb-5 flex items-center gap-2">
            <Phone size={20} className="text-sunset" />
            Emergency Numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {emergencyNumbers.map(({ label, number, desc }) => (
              <a
                key={label}
                href={`tel:${number}`}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sunset/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-sunset" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-sand transition-colors">{label}</div>
                  <div className="text-sunset font-semibold text-sm">{number}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
