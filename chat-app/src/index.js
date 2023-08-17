const path = require('path') // path is default package and provided by express it self
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { createRequire } = require('module')

// utils
const { generateMessage, generateLocation } = require('./utils/messages')

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

    socket.emit('message', generateMessage('Welcome to the chat-app!') )
    socket.broadcast.emit('message', generateMessage('A new user join'))

    // Message event...
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
            // io.emit('message', 'Please type user friendly message, Profanity is not allowed ')
            return callback("Profanity is not allowed")
        }

        io.emit('message', generateMessage(message))
        callback()
    })


    socket.on('sendLocation', (coords, callback) => {
        // https://google.com/maps?q=lat,long
        io.emit('location', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })


    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user left!!'))
    })
})

server.listen(port, ()=> {
    console.log("Server is set up on Port " + port )
})