require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//added later ->
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    preflightContinue: true
}))
// <--

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const citiesRouter = require('./routes/cities.js')
app.use('/cities', citiesRouter)

app.listen(8000, () => console.log('Server started'))