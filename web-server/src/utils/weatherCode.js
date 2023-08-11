const request = require('postman-request');

const weather = (query, units ,callback) => {
    let url = 'http://api.weatherstack.com/current?access_key=040c81a6fa5cdf38697f269a95c93b13&query='+query
    if (units) {
        url = url+'&units='+units   
    }
    

    request( { url: url, json: true }, (error, response) => {
        console.log(response.body)
        if (error){
            callback('Unable to connect location services', undefined)
        }
        else if(response.body.error){
            callback('Unable to find location', undefined)
        }
        else{
             callback(undefined, response.body)
        }
    })

}

module.exports = weather