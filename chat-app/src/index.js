const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const port = process.env.PORT || 3000


const app = express()
//NOTE: NOT necessary to call ni general express set up -> express creates its own
//NOTE: Created http server for passing it into socketio function call
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New web socket connection')

    socket.emit('message', 'Welcome to the chat-app!' )
    socket.broadcast.emit('message', 'A new user join')
    socket.on('dataSent', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('message',"A user left!!")
    })
})

server.listen(port, ()=> {
    console.log("Server is set up on Port " + port )
})