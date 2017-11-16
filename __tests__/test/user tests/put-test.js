'use strict'

import expect from 'expect'
import superagent from 'superagent'
import cleanDB from '../../lib/clean-db'
import User from '../../../src/models/user'
import { start, stop } from '../../../src/lib/server'
import { mockUser } from '../../lib/mock-data'

let TEST_API_URL = `http://localhost:${process.env.PORT}`

describe('User Test Module', function(){
  beforeAll(start)
  afterAll(stop)
  afterAll(cleanDB)

  describe('valid requests', function(){
    describe('POST /api password updates', () => {
      beforeAll(() => {
        return superagent.post(`${TEST_API_URL}/api/signup`)
          .send(mockUser)
          .then(res => this.res = res)
          .catch(err => console.error(err))
      })

      test('a thing', () => {
        expect(true).toBe(true)
      })

      test('should update a user', () => {
        return superagent.put(`${TEST_API_URL}/api/updatePassword/${mockUser.email}/uwotmate`)
          .set('Authorization', `Bearer ${this.res.body}`)
          .then(res => expect(this.res.status).toBe(200))
      })
      
      test('should reset the password of a user', () => {
        return superagent.put(`${TEST_API_URL}/api/forgotPassword/${mockUser.email}`)
          .set('Authorization', `Bearer ${this.res.body}`)
          .then(res => expect(this.res.status).toBe(200))
      })

    })
 
 
  })
})