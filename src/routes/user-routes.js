'use strict'

import express from 'express'
import User from '../models/user'
import basicAuth from '../middleware/basic-auth-middleware'
import bearerAuth from '../middleware/bearer-auth-middleware'
const debug = require('debug')('club-user-routes')

module.exports = function(router){

  router.post('/signup', (req, res) => {
    debug('#POST /signup')

    let tempPassword = req.body.password
    req.body.password = null
    delete req.body.password

    User.signup(req.body, tempPassword)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err.message))
  })

  router.get('/signin', basicAuth, (req, res) => {
    debug('#GET /signin')

    User.signin(req.auth)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err.message))
  })

  return router
}