'use strict'

import express from 'express'
import bearerAuth from '../middleware/bearer-auth-middleware'
import Club from '../models/club.js'

const debug = require('debug')('club-dev:club-routes')

module.exports = function(router){

  router.post('/club/new', bearerAuth, (req, res) => {
    debug('#Post /club/new')
    
    Club.createClub(req.body)
      .then(club => res.json(club))
      .catch(err => res.status(err.status).send(err))
  })

  router.get('/clubs', (req, res) => {
    debug('#GET /clubs')

    Club.fetchAll()
      .then(club => res.json(club))
      .catch(err => res.status(err.status).send(err))
  })

  router.get('/club/:city', (req, res) => {
    debug('#GET /club/city')

    Club.fetchOne(req.params.city)
      .then(club => res.json(club))
      .catch(err => res.status(err.status).send(err))
  })

  router.put('/club/update/:city', bearerAuth, (req, res) => {
    debug('#PUT /updateclub/clubId')

    Club.updateClub(req.params.city, req.body)
    .then(club => res.json(req.body))
      .catch(err => res.status(err.status).send(err.message))
  })

  router.delete('/club/delete/:clubId', bearerAuth, (req, res) => {
    debug('#Delete /removeclub/:clubId')

    Club.deleteClub(req.params.clubId)
      .then(club => res.json(club))
      .catch(err => res.status(err.status).send(err))
  })

  return router
}