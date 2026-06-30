export const AUCTION_CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Art & Collectibles', value: 'art' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Jewelry & Watches', value: 'jewelry' },
  { label: 'Fashion & Apparel', value: 'fashion' },
  { label: 'Vehicles', value: 'vehicles' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Sports & Outdoors', value: 'sports' },
  { label: 'Books & Manuscripts', value: 'books' },
  { label: 'Music Instruments', value: 'music' },
  { label: 'Antiques', value: 'antiques' },
  { label: 'Other', value: 'other' },
]

export const AUCTION_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
}

export const AUCTION_STATUS_LABEL = {
  upcoming: 'Upcoming',
  active: 'Live',
  ended: 'Ended',
  cancelled: 'Cancelled',
}

export const AUCTION_STATUS_COLOR = {
  upcoming: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  active: 'bg-green-500/15 text-green-400 border-green-500/30',
  ended: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
}

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

export const SORT_OPTIONS = [
  { label: 'Ending Soon', value: 'endDate:asc' },
  { label: 'Newest First', value: 'createdAt:desc' },
  { label: 'Lowest Bid', value: 'currentBid:asc' },
  { label: 'Highest Bid', value: 'currentBid:desc' },
  { label: 'Most Bids', value: 'totalBids:desc' },
]

export const PAGINATION_LIMIT = 12

export const MAX_IMAGE_SIZE_MB = 5
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const MIN_BID_INCREMENT = 100 // ₹100 minimum increment

export const ROUTES = {
  HOME: '/',
  AUCTIONS: '/auctions',
  AUCTION: (id) => `/auction/${id}`,
  CREATE_AUCTION: '/auction/create',
  DASHBOARD: '/dashboard',
  MY_AUCTIONS: '/dashboard/my-auctions',
  MY_BIDS: '/dashboard/my-bids',
  PROFILE: '/dashboard/profile',
  LOGIN_HISTORY: '/dashboard/login-history',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_AUCTIONS: '/admin/auctions',
}
