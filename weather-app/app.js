// Simple HTTP request 

// const request = require('postman-request');
// const url = 'http://api.weatherstack.com/current?access_key=040c81a6fa5cdf38697f269a95c93b13&query=New%20York'
// request( { url: url, json: true }, (error, response) => {
//     if(error){
//         console.log("Unable to get response", error)
//     }
//     else if(response.body.error){
//         console.log("Unable to process request.", response.body.error)
//     }
//     else{
//         console.log("It is currently", response.body.current.temperature, "degree out. It feels like", response.body.current.feelslike, "degree out.")
//     }
// })


// Update above code with callback function


const weather = require('./utils/weatherCode')
const location = process.argv[2]
const units = process.argv[3]

if (!location) {
    console.log("Please provide location")
}
else{
    weather(location, units, (error, data) => {
        if (error){
            return console.log(error)
        }
        console.log("Data: ", data)
    })
}