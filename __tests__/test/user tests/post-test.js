'use strict'

import expect from 'expect'
import superagent from 'superagent'
import cleanDB from '../../lib/clean-db'
import User from '../../../src/models/user'
import { start, stop } from '../../../src/lib/server'
import { mockUser } from '../../lib/mock-data'

let TEST_API_URL = `http://localhost:${process.env.PORT}`

describe('Location Test Module', function(){
  beforeAll(start)
  afterAll(stop)
  afterAll(cleanDB)
  
  describe('valid requests', function(){
    describe('POST api/signup', () => {
      beforeAll(() => {
        return superagent.post(`${TEST_API_URL}/api/signup`)
          .send(mockUser)
          .then(res => this.res = res)
          .catch(err => console.error(err))
      })
        
      test('should create a new user', () => {
        expect(this.res.status).toBe(200)
      }) 
    })

  })

  describe('invalid requests', function(){
    describe('incorrect endpoint', () => {
      test('should throw a 404 error', () => {
        return superagent.post(`${TEST_API_URL}/api/heresating`)
          .send(mockUser)
          .catch(err => expect(err.status).toBe(404))
      })
    })

    describe('bad request body', function(){
      test('should throw a 400', () => {
        return superagent.post(`${TEST_API_URL}/api/signup`)
          .send({})
          .catch(err => expect(err.status).toBe(400))
      })
    })

  })


})
  