import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { updateCurrentBid } from '../store/auctionSlice'
import { toast } from 'sonner'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export function useSocket(auctionId) {
  const socketRef = useRef(null)
  const dispatch = useDispatch()
  const [activeUsers, setActiveUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data)
  }, [])

  useEffect(() => {
    if (!auctionId) return

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('auction:join', { auctionId })
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('auction:userJoined', ({ activeUsers }) => {
      setActiveUsers(activeUsers ?? [])
    })

    socket.on('auction:userLeft', ({ activeUsers }) => {
      setActiveUsers(activeUsers ?? [])
    })

    socket.on('auction:newBid', (bid) => {
      dispatch(updateCurrentBid({ auctionId, bid }))
      toast.info(`New bid: ₹${bid.amount.toLocaleString('en-IN')} by ${bid.bidder?.name ?? 'Someone'}`, {
        duration: 3000,
      })
    })

    socket.on('auction:ended', ({ winner }) => {
      toast.success(winner ? `Auction ended! Winner: ${winner.name}` : 'Auction has ended.', {
        duration: 6000,
      })
    })

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message)
    })

    return () => {
      socket.emit('auction:leave', { auctionId })
      socket.disconnect()
    }
  }, [auctionId, dispatch])

  return { socket: socketRef.current, activeUsers, isConnected, emit }
}
