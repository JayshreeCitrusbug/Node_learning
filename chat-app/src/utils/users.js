const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            "error": "Username and room name are required"
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate user name
    if(existingUser){
        return {
            "error": "username already taken!"
        }
    }


    // Storing user
    const user= { id, username, room }
    users.push(user)
    return{ user }
}

// REmove user
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}


// Get user
const getUser = (id) => {
    return users.find((user) => user.id === id)
}


const getUserInRoom = (room) => {
    return users.filter( (user) => {
        return user.room === room.trim().toLowerCase()

    })
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
