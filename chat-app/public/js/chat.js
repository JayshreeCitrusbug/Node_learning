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

socket.on('message', (message) => {
    console.log("message rendering -> ", message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createAt: moment(message.createAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

socket.on('location', (message) => {
    console.log("location rendering -> ", message)
    const html = Mustache.render(locationTemplate, {
        location: message.location,
        createAt: moment(message.createAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

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