export function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on('auction:join', ({ auctionId }) => {
      socket.join(auctionId)
      const room = io.sockets.adapter.rooms.get(auctionId)
      const count = room ? room.size : 0
      io.to(auctionId).emit('auction:userJoined', { activeUsers: [], count })
    })

    socket.on('auction:leave', ({ auctionId }) => {
      socket.leave(auctionId)
    })

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })
}
