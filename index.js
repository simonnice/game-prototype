const express = require('express')
const app = express()
const path = require('path')

// Including routes
let routes = require('./routes/index')

// Adding a route for static files
app.use(express.static(path.join(__dirname, '/public')))


// Setting up view engine
// and 'views' to represent '/root/views'
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))

// Routes
app.use('/', routes)

app.listen(3000, () => console.log('Example app listening on port 3000!'))