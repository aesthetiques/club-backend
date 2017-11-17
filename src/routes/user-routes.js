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

  router.get('/userList', bearerAuth, (req, res) => {
    debug('#GET /userList')

    User.listUsers()
      .then(list => res.json(list))
      .catch(err => res.status(err.stauts).send(err))
  })

  router.put('/forgotPassword', (req, res) => {
    debug('#PUT /forgotPassword')

    let tempEmail = req.body.email
    req.body.email = null
    delete req.body.password

    User.forgotPassword(tempEmail)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err))
  })
  
  router.put('/updatePassword', bearerAuth, (req, res) => {
    debug('#PUT /updatePassword')

    let tempEmail = req.body.email
    req.body.email = null
    delete req.body.email

    let tempPassword = req.body.password
    req.body.password = null
    delete req.body.password

    User.updatePassword(tempEmail, tempPassword)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err))
  })

  router.delete('/deleteUser', bearerAuth, (req, res) => {
    debug('#DELETE /deleteUser')

    let tempEmail = req.body.email
    req.body.email = null
    delete req.body.email

    User.deleteUser(tempEmail)
      .then(deletedUser => deletedUser)
      .catch(err => res.status(err.status).send(err))
  })

  return router
}