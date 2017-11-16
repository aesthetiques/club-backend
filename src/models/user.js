'use strict'

import bcrypt from 'bcrypt'
import crypto, { randomBytes, createECDH } from 'crypto'
import faker from 'faker'
import jwt from 'jsonwebtoken'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import createError from 'http-errors'
const debug = require('debug')('club:user-model')

const Schema = mongoose.Schema

const userSchema = Schema({
  findHash: {type: String, unique: true},
  password: {type: String, required: true},  
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
})

userSchema.methods.generatePasswordHash = function(password){
  debug('generatePasswordHash')
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(createError(401, 'Password hash failed'))
      this.password = hash
      resolve(this)
    })
  })
}

userSchema.methods.comparePasswordHash = function(password) {
  debug('#comparePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(createError(401, 'Password validation failed'));
      if(!valid) return reject(createError(401, 'Wrong password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function() {
  debug('#generateFindHash');
  return new Promise((resolve, reject) => {
    let tries = 0;
    let _generateFindHash = () => {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => resolve(this.findHash))
      .catch(err => {
        console.log(err);
        if (tries > 3) return reject(createError(401, 'Generate findhash failed'));
        tries ++;
        _generateFindHash;
      });
    };
    _generateFindHash();
  });
};

userSchema.methods.generateToken = function() {
  debug('#generateToken');

  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then(findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECRET)))
    .catch(err => {
      console.log(err);
      reject(createError(401, 'Generate token failed'));
    });
  });
};

const User = mongoose.model('user', userSchema);

User.signup = function(userData, password){
  debug('#signup')
  if(!password) return Promise.reject(createError(400, 'password required'))
  if(!userData.email) return Promise.reject(createError(400, 'email requried'))
  if(!userData.username) return Promise.reject(createError(400, 'username required'))

  let newUser = new User(userData)
  return newUser.generatePasswordHash(password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => token)
    .catch(err => Promise.reject(createError(err.message)))
}

User.forgotPassword = function(email){
  debug('#resetPassword')
  if(!email) return Promise.reject(createError(400, 'no email included'))

  let randomPassword = faker.internet.ip()

  return User.findOneAndUpdate(email, { password: randomPassword })
    .then(user => user.generatePasswordHash(randomPassword))
    .then(user => user.generateToken())
    .then(token => token)
    .then(() => {
      return {
        randomPassword,
        email
      }
    })
    .catch(err => Promise.reject(createError(err.status, err.message)))
}

User.updatePassword = function(email, password){
  if(!email) return Promise.reject(createError(400, 'no email included'))
  if(!password) return Promise.reject(createError(400, 'no password included'))

  return User.findOneAndUpdate(email, {password: password})
    .then(user => user.generatePasswordHash(password))
    .then(user => user.generateToken())
    .then(token => token)
    .then(() => password)
    .catch(err => Promise.reject(createError(err.status, err.message)))
}

User.signin = function(userData){
  debug('#login')
  if(!userData.username) return Promise.reject(createError(400, 'username required'))
  if(!userData.password) return Promise.reject(400, 'Password required')

  return User.findOne({username: userData.username})
    .then(user => user.comparePasswordHash(userData.password))
    .then(user => user.generateToken())
    .then(token => token)
    .catch(err => Promise.reject(createError(err.status, err.message)))
}

export default User