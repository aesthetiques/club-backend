'use strict'

import jwt from 'jsonwebtoken'
import User from '../models/user'
import createError from 'http-errors'
const debug = require('debug')('narratus:bearer-auth-middleware')

module.exports = function(req, res, next) {
  debug('bearer-auth-middleware')

  let authHeaders = req.headers.authorization
  if(!authHeaders) return next(createError(401, 'Authorization headers required'))

  let token = authHeaders.split('Bearer ')[1]
  if(!token) return next(createError(401, 'Token required'))

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if(err) return next(err)

    User.find({findHash: decoded.token})
    .then(user => {
      req.user = user[0]
      next()
    })
    .catch(err => next(createError(401, err.message)))
  })
}
