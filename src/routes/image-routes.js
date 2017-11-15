'use strict'

import express from 'express'
import bearerAuth from '../middleware/bearer-auth-middleware'
import Image from '../models/image.js'

const debug = require('debug')('club-dev:image-routes')

module.exports = function(router){

  router.post('/image/new', bearerAuth, (req, res) => {
    debug('#POST /image/new')

    Image.create(req.body)
      .then(image => res.json(image))
      .catch(err => res.status(err.status).send(err))
  })

  //This will be for users - returning only the images for a specific club location.
  router.get('/images/:city', (req, res) => {
    debug('GET /images/:city')

    Image.fetchAll(req.params.city)
      .then(images => res.json(images))
      .catch(err => res.status(err.status).send(err))
  })

  router.get('/admin-images', bearerAuth, (req, res) => {
    debug('#GET /admin-images')

    Image.adminFetchAll()
      .then(images => res.json(images))
      .catch(err => res.status(err.status).send(err))
  })

  router.put('/image/update/:imageId', bearerAuth, (req, res) => {
    debug('#PUT /image/update/:imageId')

    Image.update(req.params.imageId, req.body)
      .then(image => res.json(image))
      .catch(err => res.status(err.status).send(err))
  })

  router.delete('/image/delete/:imageId', bearerAuth, (req, res) => {
    debug('#DELETE /image/delete/:imageId')
    
    Image.delete(req.params.imageId)
      .then(image => res.json(image))
      .catch(err => res.status(err.status).send(err))
  })

  return router
}