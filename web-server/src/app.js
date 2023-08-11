const path  = require('path')
const express = require('express') 
const hbs = require('hbs') 
const weather = require('./utils/weatherCode')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()

// Define path for config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set handlerbars 
app.set('view engine', 'hbs')

// Customizing views folder name with templates
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: "Jayshree"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Jayshree'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Jayshree',
        helpText: 'Help page text'
    })
})

// Simple get 
// app.get('', (req, res) => {
//     res.send("Hello from express")
// })


//Weather
app.get('/weather', (req, res) => {
    const units = req.query.units
    if (!req.query.address) {
        return res.send({
            error: 'Address required'
        })
    }
    else{
        weather(req.query.address, units, (error, data) => {
            if (error){
                // console.log(error)
                return res.send({
                    error
                })
                
            }
            // console.log("Data: ", data)
            res.send({
                forecast: data.current.weather_descriptions[0],
                location: req.query.address,
                description: "Current temperature of "+data.location.name +' '+ data.location.country+ ' is '+ data.current.temperature
            })
        })
    }
    
})

app.get('/products', (req, res) => {
    console.log(req.query)
    res.send({
        products: []
    })
})

// app.get('*', (req, res) => {
//     res.send('404 page')
// })
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Jayshree',
        errorMessage: 'Page not found.'
    })
})


app.listen(3000, () => {
    console.log("Server started.!")
})