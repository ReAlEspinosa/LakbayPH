import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import DiscoverPage from './pages/DiscoverPage'
import DestinationDetail from './pages/DestinationDetail'
import PlannerPage from './pages/PlannerPage'
import BookingsPage from './pages/BookingsPage'
import CommunityPage from './pages/CommunityPage'
import RoadsidePage from './pages/RoadsidePage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import FitnessApp from './fitness/FitnessApp'

export default function App() {
  const location = useLocation()
  const isFitness = location.pathname === '/fitness'

  useEffect(() => {
    // Dev builds serve modules unhashed; a cached service worker there hands
    // back stale bundles and looks like a phantom bug.
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  if (isFitness) {
    return <FitnessApp />
  }

  return (
    <div className="min-h-screen bg-bg font-body">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/roadside" element={<RoadsidePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
