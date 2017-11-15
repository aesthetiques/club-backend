'use strict'

import bearerAuth from '../middleware/bearer-auth-middleware'
import Directory from  '../models/directory'
import express from 'express'

const debug = require('debug')('club-dev:directory-routes')

module.exports = function(router){

  router.post('/directory/new', bearerAuth, (req, res) => {
    debug('#POST /directory/new')

    Directory.createDirectory(req.body)
      .then(directory => res.json(directory))
      .catch(err => res.status(err.status).send(err))
  })

  router.get('/directory', (req, res) => {
    debug('#GET /directory')

    Directory.fetchDirectory()
      .then(directory => res.json(directory))
      .catch(err => res.status(err.status).send(err))
  })

  return router
}