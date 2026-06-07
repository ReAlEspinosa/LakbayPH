import React from 'react'
import { Routes, Route } from 'react-router-dom'
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

export default function App() {
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
