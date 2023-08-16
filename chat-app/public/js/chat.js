const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#form').addEventListener('submit', (e) => {
    e.preventDefault()
    // const message = document.querySelector('#inputMessage').value
    const message = e.target.elements.inputMessage.value
    socket.emit('dataSent', message)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geo location not supported')
    }
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position)
    })
})