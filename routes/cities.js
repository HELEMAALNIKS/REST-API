const express = require('express')
const router = express.Router()
const City = require('../models/city')

//Getting all
router.get('/', async (req, res) => {
    try {
        const cities = await City.find()
        res.json(cities)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }
})
//Getting one
router.get('/:id', getCity, (req, res) => {
    res.json(res.city)
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
//Updating one
router.patch('/:id', getCity, async (req, res) => {
    if (req.body.name != null) {
      res.city.name = req.body.name
    }
    if (req.body.population != null) {
      res.subscriber.population = req.body.population
    }
    if (req.body.federalState != null) {
        res.subscriber.federalState = req.body.federalState
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
      res.json({ message: 'Deleted City' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

// async function getCity(req, res, next) {
//     let city
//     try { 
//         city = await City.findById(req.params.id)
//         if (city == null) {
//             return res.status(404).json({ message: 'Cannot find city'})
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message })

//     }

//     res.city = city
//     next()
// }


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
