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

  router.put('/forgotPassword/:email', (req, res) => {
    debug('#PUT /forgotPassword/:email')

    let tempEmail = req.params.email
    req.params.email = null
    delete req.body.password

    User.forgotPassword(tempEmail)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err))
  })
  
  router.put('/updatePassword/:email/:password', (req, res) => {
    debug('#PUT /updatePassword/:email/:password')

    let tempEmail = req.params.email
    req.params.email = null
    delete req.params.email

    let tempPassword = req.params.password
    req.params.password = null
    delete req.params.password

    User.updatePassword(tempEmail, tempPassword)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err))
  })

  router.get('/signin', basicAuth, (req, res) => {
    debug('#GET /signin')

    User.signin(req.auth)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err.message))
  })

  return router
}