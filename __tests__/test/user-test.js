'use strict'

import expect from 'expect'
import superagent from 'superagent'
import cleanDB from '../lib/clean-db'
import User from '../../src/models/user'
import { start, stop } from '../../src/lib/server'
import { mockUser } from '../lib/mock-data'

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


})
  