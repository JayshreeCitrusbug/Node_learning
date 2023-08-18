const socket = io()

// Elements
const $form = document.querySelector('#form')
const $formInput = $form.querySelector('input')
const $formButton = $form.querySelector('button')
const $locationSendButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

// options (querystring)
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// AUTO SCROLLING

const autoScroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild


    // Height of the message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // Height of message container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled
    const scrollOffSet = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffSet) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


// MESSAGE
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        name: message.username,
        message: message.text,
        createAt: moment(message.createAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()

})

// LOCATION
socket.on('location', (location) => {
    const html = Mustache.render(locationTemplate, {
        name: location.username,
        location: location.location,
        createAt: moment(location.createAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


//LISTING ALL DETAILS
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html

})

// HTML event
$form.addEventListener('submit', (e) => {
    e.preventDefault()

    //Disable submit button
    $formButton.setAttribute('disabled', 'disabled')
    // const message = document.querySelector('#inputMessage').value
    const message = e.target.elements.inputMessage.value
    socket.emit('sendMessage', message, (error) => {

        //Enabled button after mes send and remove previous message text 
        $formButton.removeAttribute('disabled')
        $formInput.value = ''
        $formInput.focus()
         
        if(error) {

            return console.log(error)
        }
        console.log('Message Delivered!')
    })
})


// HTML event
$locationSendButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geo location not supported')
    }
    // Disabled button because it already press and server is fetching Geo location data
    $locationSendButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition(function(position){
        data = {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
        }
        socket.emit('sendLocation', data, () => {
            $locationSendButton.removeAttribute('disabled')
            console.log("Location shared!")
        })
    })
})

// ERROR DISPLAY ON JOIN
socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})

// document.querySelector('#invite-user').addEventListener('click', () => {

//     socket.emit('inviteUser', {username, room}, (error) => {
//         if(error){
//             alert(error)
//             // location.href = '/chat.html'
//         }
//         console.log("------------------------------------")
//         console.log(username, room)
//     })
// })