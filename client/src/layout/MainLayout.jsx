import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import MotionBackground from '../components/shared/MotionBackground'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      <MotionBackground />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
