import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '../layout/MainLayout'
import AuthLayout from '../layout/AuthLayout'
import AdminLayout from '../layout/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import GuestRoute from './GuestRoute'
import LoadingSpinner from '../components/shared/LoadingSpinner'

// Lazy-load pages for code splitting
const Home = lazy(() => import('../pages/Home'))
const Auctions = lazy(() => import('../pages/auction/Auctions'))
const ViewAuction = lazy(() => import('../pages/auction/ViewAuction'))
const CreateAuction = lazy(() => import('../pages/auction/CreateAuction'))
const AuctionWinner = lazy(() => import('../pages/auction/AuctionWinner'))
const Contact = lazy(() => import('../pages/Contact'))
const CommunityHelp = lazy(() => import('../pages/CommunityHelp'))
const NotFound = lazy(() => import('../pages/NotFound'))

const Login = lazy(() => import('../pages/auth/Login'))
const Signup = lazy(() => import('../pages/auth/Signup'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const MyAuctions = lazy(() => import('../pages/dashboard/MyAuctions'))
const MyBids = lazy(() => import('../pages/dashboard/MyBids'))
const ProfileSettings = lazy(() => import('../pages/dashboard/ProfileSettings'))
const LoginHistory = lazy(() => import('../pages/dashboard/LoginHistory'))

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const UserManagement = lazy(() => import('../pages/admin/UserManagement'))
const AuctionModeration = lazy(() => import('../pages/admin/AuctionModeration'))
const UserActivities = lazy(() => import('../pages/admin/UserActivities'))

const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingSpinner size="lg" />
  </div>
)

const wrap = (el) => <Suspense fallback={<Loader />}>{el}</Suspense>

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: wrap(<Home />) },
      { path: 'auctions', element: wrap(<Auctions />) },
      { path: 'auction/:id', element: wrap(<ViewAuction />) },
      { path: 'auction/:id/winner', element: wrap(<AuctionWinner />) },
      { path: 'contact', element: wrap(<Contact />) },
      { path: 'performance', element: wrap(<CommunityHelp />) },
      { path: 'community-help', element: wrap(<CommunityHelp />) },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'auction/create', element: wrap(<CreateAuction />) },
          { path: 'dashboard', element: wrap(<Dashboard />) },
          { path: 'dashboard/my-auctions', element: wrap(<MyAuctions />) },
          { path: 'dashboard/my-bids', element: wrap(<MyBids />) },
          { path: 'dashboard/profile', element: wrap(<ProfileSettings />) },
          { path: 'dashboard/login-history', element: wrap(<LoginHistory />) },
        ],
      },

      // Admin routes
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { element: <AdminLayout />, children: [
            { index: true, element: wrap(<AdminDashboard />) },
            { path: 'users', element: wrap(<UserManagement />) },
            { path: 'auctions', element: wrap(<AuctionModeration />) },
            { path: 'activities', element: wrap(<UserActivities />) },
          ]},
        ],
      },
    ],
  },

  // Auth pages (separate layout, protected by GuestRoute so logged-in users see profile instead of login options)
  {
    element: <AuthLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: '/auth/login', element: wrap(<Login />) },
          { path: '/auth/signup', element: wrap(<Signup />) },
          { path: '/auth/forgot-password', element: wrap(<ForgotPassword />) },
        ],
      },
    ],
  },

  { path: '*', element: wrap(<NotFound />) },
])
