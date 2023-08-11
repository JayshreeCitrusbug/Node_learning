console.log('Client side javascript file is loaded!')

// fetch('http://api.weatherstack.com/current?access_key=040c81a6fa5cdf38697f269a95c93b13&query=New%20%York').then((response) => {
//     response.json().then((data) => {
//         console.log(data)
//     })
// })

// fetch('http://localhost:3000/weather/?address=!').then((response) => {
//     response.json().then((data) => {
//         if(data.error){
//             console.log(data.error)
//         }
//         console.log(data)
//     })
// })


const formData = document.querySelector('form')
const search = document.querySelector('input')
let message1 = document.getElementById('message1')
let message2 = document.getElementById('message2')

formData?.addEventListener('submit', (e) => {
    e.preventDefault()

    const address = search.value
    url = 'http://localhost:3000/weather/?address='+address

    fetch(url).then((response) => {
        // message1.innerHTML = ''
        // message2.innerHTML = ''
    response.json().then((data) => {
        if(data.error){
            message1.innerHTML = data.error
            
        }
        else{
            message1.innerHTML = data.description
            message2.innerHTML = "Overall weather feels like:  "+data.forecast
        }
        
    })
})
    
})