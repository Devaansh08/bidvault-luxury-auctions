import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { auctionService } from '../services/auctionService'
import { setAuctions, setCurrentAuction } from '../store/auctionSlice'
import { toast } from 'sonner'

export function useAuctions(filters = {}) {
  const dispatch = useDispatch()

  return useQuery({
    queryKey: ['auctions', filters],
    queryFn: async () => {
      const { data } = await auctionService.getAuctions(filters)
      dispatch(setAuctions({ auctions: data.auctions, total: data.total }))
      return data
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
      const { data } = await auctionService.getAuction(id)
      const enrichedAuction = { ...data.auction, bids: data.bids || data.auction?.bids || [] }
      dispatch(setCurrentAuction(enrichedAuction))
      return enrichedAuction
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
