'use strict'

import Promise from 'bluebird'
import mongoose from 'mongoose'
import createError from 'http-errors'
import Directory from './directory'
const debug = require('debug')('club-dev:club-controller')

const Schema = mongoose.Schema

const clubSchema = Schema({
  caption: {type: String},
  city: {type: String, required: true},
  location: {type: String, required: true},
  clubPicture: {type: String, required: true},
})

const Club = mongoose.model('club', clubSchema)

Club.createClub = function(clubData){
  debug('Club #createClub')
  if(!clubData) return Promise.reject(createError(400, 'no club included'))

  return Directory.findOne({})
    .then(directory => {
      return new Club(clubData).save()
        .then(club => {
          directory.clubs.push(club.city)
          directory.save()
            .then(directory => Promise.resolve(directory))
            .catch(err => Promise.reject(createError(404, err.message)))
        })
      })
    .then(club => Promise.resolve(club))
    .catch(err => Promise.reject(createError(400, err.message)))
}

Club.fetchAll = function(){
  debug('Club #fetchAll')

  return Club.find()
    .then(club => Promise.resolve(club))
    .catch(err => Promise.reject(createError(400, err.message)))
}

Club.fetchOne = function(city){
  debug('Club #fetchOne')
  if (!city) return Promise.reject(createError(400, 'No club id included'))

  return Club.findOne({ city: city })
    .then(club => Promise.resolve(club))
    .catch(err => Promise.reject(createError(404, err.message)))
}

Club.updateClub = function(city, newData){
  debug('Club #updateOne')
  if(!city) return Promise.reject(createError(400, 'No club id included'))
  if(!newData) return Promise.reject(createError(400, 'No club object included'))

  return Club.findOneAndUpdate({city: city}, newData)
    .then(club => Promise.resolve(club))
    .catch(err => Promise.reject(createError(404, 'No club found')))
}

Club.deleteClub = function(city){
  debug('Club #deleteClub')
  if (!city) return Promise.reject(createError(400, 'No club included'))

  return Directory.findOne({})
    .then(directory => {
      return Club.findOneAndRemove({city: city})
        .then(club => {
          directory.clubs.pull(city)
          directory.save()
          .then(directory => Promise.resolve(directory))
          .catch(err => Promise.reject(createError(404, err.message)))
        })
      })
    .then(club => Promise.resolve(club))
    .catch(err => Promise.reject(createError(404, err.message)))
}

export default Club