import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu, X, Anchor, MapPin, Heart, Award, Clock } from 'lucide-react'

const navLinks = [
  { label: 'Discover', path: '/discover' },
  { label: 'Plan', path: '/planner' },
  { label: 'Book', path: '/bookings' },
  { label: 'Community', path: '/community' },
  { label: 'Roadside', path: '/roadside' },
]

const notifications = [
  { icon: MapPin, color: 'text-ocean bg-ocean/10', text: 'Maria Gabriela visited El Nido, Palawan', time: '2h ago', unread: true },
  { icon: Award, color: 'text-coral bg-coral/10', text: 'You earned the "Island Hopper" badge!', time: '1d ago', unread: true },
  { icon: Heart, color: 'text-coral bg-red-50', text: 'Carlos saved your El Nido tip to his bucket list', time: '2d ago', unread: false },
  { icon: Clock, color: 'text-palm bg-palm/10', text: 'Trip reminder: Siargao trip starts in 3 days', time: '3d ago', unread: false },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)
  const location = useLocation()

  const unreadCount = notifications.filter((n) => n.unread).length

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setNotifOpen(false)
  }, [location])

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen])

  const isActive = (path) => location.pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ocean flex items-center justify-center">
              <Anchor size={16} className="text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-ocean">Lakbay</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  link.path === '/roadside'
                    ? isActive(link.path)
                      ? 'bg-sunset text-white'
                      : 'text-sunset hover:bg-sunset/10'
                    : isActive(link.path)
                    ? 'bg-ocean text-white'
                    : 'text-gray-600 hover:text-ocean hover:bg-ocean/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div ref={notifRef} className="relative hidden md:block">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-500 hover:text-ocean hover:bg-ocean/10 rounded-lg transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-coral rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-ocean font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    {notifications.map((n, i) => {
                      const Icon = n.icon
                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-ocean/[0.03]' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.color}`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-700 text-xs leading-relaxed">{n.text}</p>
                            <p className="text-gray-400 text-[10px] mt-0.5">{n.time}</p>
                          </div>
                          {n.unread && <div className="w-2 h-2 rounded-full bg-ocean flex-shrink-0 mt-1.5" />}
                        </div>
                      )
                    })}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 text-center">
                    <button className="text-xs text-ocean font-medium hover:underline">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile avatar */}
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ocean/10 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean to-palm flex items-center justify-center text-white text-xs font-bold">
                MG
              </div>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  link.path === '/roadside'
                    ? isActive(link.path)
                      ? 'bg-sunset text-white'
                      : 'text-sunset'
                    : isActive(link.path)
                    ? 'bg-ocean text-white'
                    : 'text-gray-700 hover:bg-ocean/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ocean to-palm flex items-center justify-center text-white text-xs font-bold">
                MG
              </div>
              My Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
