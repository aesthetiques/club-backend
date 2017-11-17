'use strict'

import express from 'express'
import User from '../models/user'
import basicAuth from '../middleware/basic-auth-middleware'
import bearerAuth from '../middleware/bearer-auth-middleware'
const debug = require('debug')('club-user-routes')

module.exports = function(router){

  //signup requires username, email, password
  router.post('/signup', (req, res) => {
    debug('#POST /signup')

    let tempPassword = req.body.password
    req.body.password = null
    delete req.body.password

    User.signup(req.body, tempPassword)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err.message))
  })


  //signs in using basic auth. expects username and password
  router.get('/signin', basicAuth, (req, res) => {
    debug('#GET /signin')

    User.signin(req.auth)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err.message))
  })

  //User list for the OG Admin account - just for adjusting the users that 
  //came afterwards if somebody is losing access to the application.
  router.get('/userList', bearerAuth, (req, res) => {
    debug('#GET /userList')

    User.listUsers()
      .then(list => res.json(list))
      .catch(err => res.status(err.stauts).send(err))
  })

  //resets to a random password, searching by email in body,
  //TODO: send email to user including the new password and a link back to the login page.
  router.put('/forgotPassword', (req, res) => {
    debug('#PUT /forgotPassword')

    let tempEmail = req.body.email
    req.body.email = null
    delete req.body.password

    User.forgotPassword(tempEmail)
      .then(token => res.json(token))
      .catch(err => res.status(err.status).send(err.message))
  })
  
  //updates password, searching by email, updating with the password, both required in the body
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
      .catch(err => res.status(err.status).send(err.message))
  })

  //searches by email in the body
  router.delete('/deleteUser', bearerAuth, (req, res) => {
    debug('#DELETE /deleteUser')

    let tempEmail = req.body.email
    req.body.email = null
    delete req.body.email

    User.deleteUser(tempEmail)
      .then(deletedUser => res.json(deletedUser))
      .catch(err => res.status(err.status).send(err.message))
  })

  return router
}