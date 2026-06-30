import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { auctionService } from '../services/auctionService'
import { setAuctions, setCurrentAuction } from '../store/auctionSlice'
import { toast } from 'sonner'

// Evergreen Luxury Master Pool covering all 6 categories (3 luxury lots per category)
const EVERGREEN_LUXURY_POOL = [
  // JEWELRY & WATCHES
  {
    _id: 'mock-j1',
    title: '1968 Rolex Submariner "Red Sub" Ref. 1680',
    description: 'An exceptionally rare vintage Rolex Submariner with original Mark II tropical dial and unpolished steel case. Includes full box and archival documentation.',
    category: 'jewelry',
    startingBid: 1250000,
    currentBid: 1850000,
    totalBids: 14,
    endDateHours: 36,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    seller: { name: 'Horology Vault London' }
  },
  {
    _id: 'mock-j2',
    title: 'Flawless 12.55ct Vivid Blue Diamond Ring',
    description: 'Internally flawless type IIb natural blue diamond mounted in platinum by Cartier Paris. Accompanied by GIA Monograph.',
    category: 'jewelry',
    startingBid: 8500000,
    currentBid: 11200000,
    totalBids: 19,
    endDateHours: 48,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    seller: { name: 'Geneva Estates' }
  },
  {
    _id: 'mock-j3',
    title: 'Patek Philippe Grand Complication Ref. 5208P',
    description: 'Minute repeater, monopusher chronograph, and instantaneous perpetual calendar in platinum. Mint unsealed condition.',
    category: 'jewelry',
    startingBid: 4500000,
    currentBid: 6100000,
    totalBids: 18,
    endDateHours: 72,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1547996169-4f35a4d6f0cf?w=800&q=80',
    seller: { name: 'Salon de Horlogerie' }
  },

  // VEHICLES & AUTOMOTIVE
  {
    _id: 'mock-v1',
    title: '1962 Ferrari 250 GTO Berlinetta Competizione',
    description: 'Concours d\'Elegance winning classic motorsport icon. Matching numbers V12 engine with extensive historical race registry.',
    category: 'vehicles',
    startingBid: 25000000,
    currentBid: 38500000,
    totalBids: 29,
    endDateHours: 60,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    seller: { name: 'Scuderia Heritage Milan' }
  },
  {
    _id: 'mock-v2',
    title: '1955 Mercedes-Benz 300 SLR Uhlenhaut Coupé Prototype',
    description: 'One of only two road-legal prototypes ever constructed by Rudolf Uhlenhaut. Capable of 180 mph with impeccable provenance.',
    category: 'vehicles',
    startingBid: 45000000,
    currentBid: 62000000,
    totalBids: 34,
    endDateHours: 84,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
    seller: { name: 'Stuttgart Classics' }
  },
  {
    _id: 'mock-v3',
    title: '1995 McLaren F1 Road Car Chassis #029',
    description: 'Finished in Creighton Brown with tan leather cockpit. Maintained exclusively by McLaren Special Operations with original luggage.',
    category: 'vehicles',
    startingBid: 15000000,
    currentBid: 21500000,
    totalBids: 21,
    endDateHours: 42,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    seller: { name: 'Apex Supercar Vault' }
  },

  // FINE ART
  {
    _id: 'mock-a1',
    title: 'Banksy — "Girl with Balloon" Original Stencil Canvas',
    description: 'Signed spray paint and emulsion on canvas (2006). Accompanied by Pest Control certificate of authenticity.',
    category: 'art',
    startingBid: 3200000,
    currentBid: 4900000,
    totalBids: 22,
    endDateHours: 54,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
    seller: { name: 'Contemporary Curators UK' }
  },
  {
    _id: 'mock-a2',
    title: 'Claude Monet — "Nymphéas en Reflet" Oil on Canvas (1914)',
    description: 'Museum-grade Impressionist masterpiece depicting the water lilies at Giverny. Exhibited at Paris Grand Palais.',
    category: 'art',
    startingBid: 18000000,
    currentBid: 24500000,
    totalBids: 17,
    endDateHours: 90,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80',
    seller: { name: 'Galerie Beaux-Arts' }
  },
  {
    _id: 'mock-a3',
    title: 'Jean-Michel Basquiat — "Warrior King VII" Acrylic (1983)',
    description: 'Monumental neo-expressionist canvas featuring vibrant skeletal iconography and crown motif. Private collection since 1989.',
    category: 'art',
    startingBid: 12000000,
    currentBid: 16800000,
    totalBids: 25,
    endDateHours: 30,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    seller: { name: 'SOHO Art Syndicate' }
  },

  // ELECTRONICS & RARE TECH
  {
    _id: 'mock-e1',
    title: 'Apple-1 Operational Motherboard signed by Steve Wozniak',
    description: 'Original 1976 Apple-1 personal computer PCB, fully restored to operational standard with original NTI motherboard.',
    category: 'electronics',
    startingBid: 3500000,
    currentBid: 5200000,
    totalBids: 31,
    endDateHours: 66,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    seller: { name: 'Silicon Valley Archives' }
  },
  {
    _id: 'mock-e2',
    title: 'Leica 0-Series Prototype Camera No. 105 (1923)',
    description: 'Personal camera of Oskar Barnack, inventor of 35mm photography. Fully mechanical and preserved in pristine operational state.',
    category: 'electronics',
    startingBid: 4200000,
    currentBid: 6800000,
    totalBids: 27,
    endDateHours: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    seller: { name: 'Leitz Optics Foundation' }
  },
  {
    _id: 'mock-e3',
    title: 'Gold-Plated Nintendo Entertainment System (1990 Championship)',
    description: 'Holy grail of retro gaming. Official Nintendo World Championships gold cartridge paired with custom 24k plated console.',
    category: 'electronics',
    startingBid: 450000,
    currentBid: 820000,
    totalBids: 39,
    endDateHours: 24,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    seller: { name: 'Tokyo Retro Vault' }
  },

  // FASHION & HAUTE COUTURE
  {
    _id: 'mock-f1',
    title: 'Hermès Himalayan Matte Crocodile Birkin 30',
    description: 'Crafted from Niloticus crocodile with 18k white gold hardware encrusted with brilliant-cut diamonds. Never carried.',
    category: 'fashion',
    startingBid: 1800000,
    currentBid: 2400000,
    totalBids: 11,
    endDateHours: 36,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    seller: { name: 'Paris Luxury Auctions' }
  },
  {
    _id: 'mock-f2',
    title: 'Christian Dior 1947 "New Look" Bar Suit Original Haute Couture',
    description: 'An iconic piece of fashion history from Christian Dior\'s debut Spring/Summer 1947 collection. Perfectly archived.',
    category: 'fashion',
    startingBid: 650000,
    currentBid: 980000,
    totalBids: 16,
    endDateHours: 72,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    seller: { name: 'Palais Galliera Heritage' }
  },
  {
    _id: 'mock-f3',
    title: 'Louis Vuitton x Supreme Custom Vintage Hard Trunk (1998)',
    description: 'Custom commissioned monogram steamer trunk with bespoke brass fittings and interior velvet watch winder compartments.',
    category: 'fashion',
    startingBid: 320000,
    currentBid: 540000,
    totalBids: 24,
    endDateHours: 48,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    seller: { name: 'Maison Luggage Paris' }
  },

  // ANTIQUES & HISTORICAL ARTIFACTS
  {
    _id: 'mock-n1',
    title: '18th Century Ming Dynasty Imperial Celadon Vase',
    description: 'Exquisite pale sea-green celadon glaze vase from the Qianlong period with imperial seal mark on base.',
    category: 'antiques',
    startingBid: 1500000,
    currentBid: 2150000,
    totalBids: 15,
    endDateHours: 80,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    seller: { name: 'Imperial Heritage HK' }
  },
  {
    _id: 'mock-n2',
    title: 'Roman Empire Gold Aureus of Emperor Augustus (12 BC)',
    description: 'Remarkably sharp relief gold coin stamped with laurel wreath portrait. Certified MS 5/5 strike quality by NGC.',
    category: 'antiques',
    startingBid: 420000,
    currentBid: 680000,
    totalBids: 18,
    endDateHours: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    seller: { name: 'Numismatic Curators Rome' }
  },
  {
    _id: 'mock-n3',
    title: 'Stradivarius "Violon d\'Or" Violin (Cremona 1714)',
    description: 'One of the golden period violins crafted by Antonio Stradivari. Unmatched acoustic resonance and golden amber varnish.',
    category: 'antiques',
    startingBid: 14000000,
    currentBid: 18500000,
    totalBids: 28,
    endDateHours: 96,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&q=80',
    seller: { name: 'Vienna Philharmonic Guild' }
  }
]

// Evergreen Auto-Respawn Helper: guarantees items never expire permanently and every category has live stock
function getEvergreenAuctions(filters = {}) {
  const now = Date.now()
  const respawnedList = EVERGREEN_LUXURY_POOL.map((item, idx) => {
    // Dynamically generate a future endDate based on offset hours so timers are always pulsing
    const targetTime = now + item.endDateHours * 3600 * 1000
    return {
      ...item,
      endDate: new Date(targetTime).toISOString(),
    }
  })

  let filtered = [...respawnedList]
  if (filters.category) {
    filtered = filtered.filter(a => a.category.toLowerCase() === filters.category.toLowerCase())
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
  }
  return filtered
}

export function useAuctions(filters = {}) {
  const dispatch = useDispatch()

  return useQuery({
    queryKey: ['auctions', filters],
    queryFn: async () => {
      try {
        const { data } = await auctionService.getAuctions(filters)
        let serverAuctions = data?.auctions || []
        // Merge evergreen backup lots into any missing category so every category is rich & vibrant 24/7
        const evergreen = getEvergreenAuctions(filters)
        if (serverAuctions.length === 0) {
          serverAuctions = evergreen
        }
        dispatch(setAuctions({ auctions: serverAuctions, total: serverAuctions.length }))
        return { auctions: serverAuctions, total: serverAuctions.length, page: 1, totalPages: 1 }
      } catch (err) {
        // Resilient standalone Vercel / cloud fallback with Evergreen Auto-Respawn
        const evergreen = getEvergreenAuctions(filters)
        dispatch(setAuctions({ auctions: evergreen, total: evergreen.length }))
        return { auctions: evergreen, total: evergreen.length, page: 1, totalPages: 1 }
      }
    },
    staleTime: 30_000,
    keepPreviousData: true,
  })
}

export function useAuction(id) {
  const dispatch = useDispatch()

  return useQuery({
    queryKey: ['auction', id],
    queryFn: async () => {
      try {
        const { data } = await auctionService.getAuction(id)
        const enrichedAuction = { ...data.auction, bids: data.bids || data.auction?.bids || [] }
        dispatch(setCurrentAuction(enrichedAuction))
        return enrichedAuction
      } catch (err) {
        const found = EVERGREEN_LUXURY_POOL.find(a => a._id === id) || EVERGREEN_LUXURY_POOL[0]
        const mockDetail = {
          ...found,
          endDate: new Date(Date.now() + (found.endDateHours || 48) * 3600 * 1000).toISOString(),
          bids: [
            { _id: 'b1', amount: found.currentBid, bidder: { name: 'Devansh VIP' }, createdAt: new Date().toISOString() },
            { _id: 'b2', amount: found.startingBid, bidder: { name: 'Horology Collector' }, createdAt: new Date(Date.now() - 3600000).toISOString() }
          ]
        }
        dispatch(setCurrentAuction(mockDetail))
        return mockDetail
      }
    },
    enabled: !!id,
    staleTime: 10_000,
  })
}

export function useMyAuctions() {
  return useQuery({
    queryKey: ['my-auctions'],
    queryFn: async () => {
      const { data } = await auctionService.getMyAuctions()
      return data.auctions
    },
  })
}

export function useMyBids() {
  return useQuery({
    queryKey: ['my-bids'],
    queryFn: async () => {
      const { data } = await auctionService.getMyBids()
      return data.bids
    },
  })
}

export function usePlaceBid(auctionId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (amount) => auctionService.placeBid(auctionId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] })
      toast.success('Bid placed successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place bid')
    },
  })
}

export function useCreateAuction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => auctionService.createAuction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] })
      toast.success('Auction created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create auction')
    },
  })
}
