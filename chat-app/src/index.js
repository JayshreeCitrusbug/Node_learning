const path = require('path') // path is default package and provided by express it self
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const request = require('postman-request');
const { createRequire } = require('module')

// utils
const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getUserInRoom} = require('./utils/users')
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

    // socket.emit('message', generateMessage('Welcome to the chat-app!') )
    // socket.broadcast.emit('message', generateMessage('A new user join'))

    
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id:socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        
        //ROOM EVENT: io.to.emit  and socket.broadcast.to.emit

        socket.emit('message', generateMessage('Admin', 'Welcome to the chat-app!') )
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined.`))
        io.to(user.room).emit('roomData' , {
            room: user.room,
            users: getUserInRoom(user.room)
        })

        callback()
    })

    // Message event...
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        const user = getUser(socket.id)

        if(filter.isProfane(message)){
            // io.emit('message', 'Please type user friendly message, Profanity is not allowed ')
            return callback("Profanity is not allowed")
        }

        if(user){
            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        }
    })


    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        // https://google.com/maps?q=lat,long
        io.to(user.room).emit('location', generateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    // socket.on('inviteUser', (data) => {
    //     // const user = getUserInRoom(data.room)
    //     url = 'http://localhost:3000/chat.html?username=J&room=Rajkotians'
    //     request({url:url, json: true}, (error, response) => {
    //         if (response){
    //             io.to(data.room).emit('message', generateMessage('Admin', `${data.username} has joined.`))
    //         }
    //     })

    // })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        
        if (user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} left the chat!`)) 
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })
})

server.listen(port, ()=> {
    console.log("Server is set up on Port " + port )
})