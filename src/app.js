const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))

const app = express()

// define path for express config:
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to server
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'chicco marualy'
    })
})

app.get('/help', (req, res)=> {
    res.render('help', {
        helpText: 'help page text',
        name:'chicco marualy',
        title: 'Help'
    })

})

app.get('/about', (req, res)=> {
    res.render('about', {
        title: 'About',
        name:'chicco marualy'
    })

})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404_page', {
        title:'404',
        name:'chicco',
        errorMassage:'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render( '404_page', {
        title: '404',
        name: 'chicco',
        errorMassage: 'Page not found'
    })
})

app.listen(3000, () =>{
    console.log('server is up in port 3000')
})