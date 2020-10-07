const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); 
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine','hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Set up static directory serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Luis'
    });
});

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Luis Angel'
    });
});

app.get('/help', (req, res) => {
    res.render('help',{
        message: 'Help here',
        title: 'Help',
        name: 'Luis'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You need to provide an address'
        });
    }

    geoCode(req.query.address,(error, {latitude, longitude, location} = {})=>{
        if(error){
           return res.send({
               error
           });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error
                });
            }
            
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
          });
    });
});

app.get('/help/*', (req, res) =>{
    res.render('404',{
        title: '404',
        message: 'Help article not found',
        name: 'Luis Angel' 
    });
});

app.get('/products', (req, res) => {
    if(!req.query.search) {
       return res.send({
            error: 'You must provide search term'
        });
    }
    
    req.query.search
    res.send({
        products: []
    });
});

app.get('*',(req, res) => {
    res.render('404',{
        title: '404',
        message: 'Page not found',
        name: 'Luis Angel'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});