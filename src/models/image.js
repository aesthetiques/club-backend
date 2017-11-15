'use strict'

const debug = require('debug')('aa-dev:image-controller')
import Promise from 'bluebird'
import mongoose from 'mongoose'
import createError from 'http-errors'

const Schema = mongoose.Schema

const imageSchema = Schema({
  url: {type: String, required: true},
  city: {type: String, required: true},
  caption: {type: String, required: true},
  location: {type: String, required: true},
  datePosted: {type: Date, default: Date.now, required: true},
})

const Image = mongoose.model('image', imageSchema)

Image.create = function(imageData){
  debug('Image #createImage')
  if(!imageData) Promise.reject(createError(400, 'No imageData included'))

  return new Image(imageData).save()
    .then(image => Promise.resolve(image))
    .catch(err => Promise.reject(createError(400, err.message)))
}

Image.fetchOne = function(imageId){
  debug('Image #fetchOne')
  if(!imageId) Promise.reject(createError(400, 'No imageId included'))

  return Image.findById(imageId).populate('firstClass standardClass')
    .then(image => Promise.resolve(image))
    .catch(err => Promise.reject(createError(404, err.message)))
}

Image.fetchAll = function(city){
  debug('Image #fetchAll')
  if(!city) Promise.reject(createError(400, 'No city included in query'))
  
  return Image.find({ city: city})
    .then(images => Promise.resolve(images))
    .catch(err => Promise.reject(createError(404, err.message)))
}

Image.adminFetchAll = function(){

  return Image.find()
    .then(images => Promise.resolve(images))
    .catch(err => Promise.reject(createError(400, err.message)))
}

Image.update = function(imageId, imageData){
  if(!imageId) Promise.reject(createError(400, 'No imageId included'))

  return Image.findByIdAndUpdate(imageId, imageData)
    .then(image => Promise.resolve(image))
    .catch(err => Promise.reject(createError(404, err.message)))
}

Image.delete = function(imageId){
  debug('Image #deleteImage')
  if(!imageId) Promise.reject(createError(400, 'No imageId included'))

  return Image.findByIdAndRemove(imageId)
  .then(removedImage => Promise.resolve(removedImage))
  .catch(err => Promise.reject(createError(400, err.message)))
}

export default Image