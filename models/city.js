const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
   name: {
        type: String,
        required: true
   },
   population: {
        type: String,
        required: true
   },
   federalState: {
        type: String,
        required: true
   }
})

module.exports = mongoose.model('City', citySchema)