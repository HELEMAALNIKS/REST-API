const express = require('express')
const router = express.Router()
const City = require('../models/city')

//Getting all
router.get('/', async (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    if(req.accepts('*/*')) {
        return res.status(406).json({ message: "This format is not allowed."})
    } else if(req.accepts(['application/json', 'application/x-www-form-urlencoded'])) {
    } else {
        return res.status(406).json({ message: "This format is not allowed."})
    }
    // try {
    //     const cities = await City.find()
    //     res.json(cities)
    try {
        const cities = await City.find()
        let items = []
        for (let i = 0; i < cities.length; i++) {
            let city = cities[i].toJSON()
            city._links = {
                self: {href: "http://" + req.headers.host + "/cities/" + city._id},
                collection: {href: "http://" + req.headers.host + "/cities"}
            }
            items.push(city)
        }
        let collection = {
            items: items,
            _links: {
                self: {href: "http://" + req.headers.host + "/cities"}
            },
            pagination: {pagination: ""}
        }
        res.status(200).json(collection)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }
})
   
//Getting details
router.get('/:id', getCity, (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  let _id = res.city._id
  let name = res.city.name
  let population = res.city.population
  let federalState = res.city.federalState
  let singleCity = {
      _id,
      name,
      population,
      federalState,
      _links: {
          self: {href: "http://" + req.headers.host + "/cities/" + res.city._id},
          collection: {href: "http://" + req.headers.host + "/cities"}
      }
  }
  res.status(200).json(singleCity)
})

//Creating one
router.post('/', async (req, res) => {
    const city = new City({
        name: req.body.name,
        population: req.body.population,
        federalState: req.body.federalState
    })
    try {
        const newCity = await city.save() 
        res.status(201).json(newCity)
    } catch (err) {
        res.status(400).json( {message: err.message })
    } 
})

//Seeing details
router.put('/:id', getCity, async (req, res) => {
  if(req.header('Accept') === "application/json") {
  } else {
      return res.status(406).json({ message: "Accept-Header is not OK" })
  }
  if(req.header('Content-Type') === "application/json") {
  } else {
      return res.status(406).json({ message: "Content-Type Header is not OK!" })
  }
  if (
      req.body.name != "" &&
      req.body.population != "" &&
      req.body.federalState != "" &&
      req.body.name != null &&
      req.body.population != null &&
      req.body.federalState != null
  ) {
      res.city.name = req.body.name
      res.city.population = req.body.population
      res.city.federalState = req.body.federalState
  } else {
      return res.status(400).json({ message: "Values can't be empty!"})
  }
  try {
      const updatedCity = await res.city.save()
      res.status(200).json(updatedCity)
  } catch (err) {
      res.status(400).json({ message: err.message })
  }
})

//Updating one
router.patch('/:id', getCity, async (req, res) => {
    if (req.body.name != null) {
      res.city.name = req.body.name
    }
    if (req.body.population != null) {
      res.city.population = req.body.population
    }
    if (req.body.federalState != null) {
        res.city.federalState = req.body.federalState
      }
    try {
      const updatedCity = await res.city.save()
      res.json(updatedCity)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

//Deleting one
router.delete('/:id', getCity, async (req, res) => {
    try {
      await res.city.remove()
      res.status(204).json({ message: 'Deleted City' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  //options
router.options('/', function(req, res) {
      let headers = {}
      headers['ALLOW'] = 'GET, POST, OPTIONS'
      headers['Acces-Control-Allow-Origin'] = "*"
      headers['Acces-Control-Allow-Headers'] = "Origin, X-Reqested-With, Content-Type, Accept"
      headers['Acces-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
      headers['Content-Length'] = 0
      headers['Content-Type'] = 'text/html'
      res.writeHead(200, headers)
      res.send()
  })

router.options('/:id', getCity,  (req, res) => {
      let headers = {}
      headers['ALLOW'] = 'GET, PUT, PATCH, DELETE, OPTIONS'
      headers['Acces-Control-Allow-Origin'] = "*"
      headers['Acces-Control-Allow-Headers'] = "Origin, X-Reqested-With, Content-Type, Accept"
      headers['Acces-Control-Allow-Methods'] = 'GET, PUT, PATCH, DELETE, OPTIONS'
      headers['Content-Length'] = 0
      headers['Content-Type'] = 'text/html'
      res.writeHead(200, headers)
      res.send()
  })

//Middleware
async function getCity(req, res, next) {
    let city
    try {
      city = await City.findById(req.params.id)
      if (city == null) {
        return res.status(404).json({ message: 'Cannot find city' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.city = city
    next()
  }

  module.exports = router
