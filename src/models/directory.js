'use strict'

import Promise from 'bluebird'
import mongoose from 'mongoose'
import createError from 'http-errors'
const debug = require('debug')('club-dev:directory-controller')

const Schema = mongoose.Schema 

const directorySchema = Schema({
  clubs: [{ type: String, required: true, unique: true }],
})

const Directory = mongoose.model('directory', directorySchema)

Directory.createDirectory = function(directoryData){
  debug('Directory #createDirectory')
  if(!directoryData) return Promise.reject(createError(400, 'no directory data included'))

  return new Directory(directoryData).save()
    .then(newDirectory => Promise.resolve(newDirectory))
    .catch(err => Promise.rejcect(createError(400, err.message)))
}

Directory.fetchDirectory = function(){
  debug('Diretory #fetchDirectory')

  return Directory.find()
    .then(directories => Promise.resolve(directories))
    .catch(err => Promise.reject(createError(404, err.message)))
}

export default Directory